"use server";

import { createFormHandler } from "@/utils/zod.utils";
import { createPostFormSchema } from "./formSchema";
import { v4 } from "uuid";
import Container from "typedi";
import { StorageService } from "@/services/StorageService";
import { PostService } from "@/services/PostService";
import { EventService } from "@/services/EventService";
import { redirect } from "next/navigation";
import { appPath } from "@/utils/path.utils";

const storageService = Container.get(StorageService);
const postService = Container.get(PostService);
const eventService = Container.get(EventService);

export const handleCreatePost = createFormHandler(
  createPostFormSchema,
  ({ platformUserId, userId, content, media }) => {
    const mediaPath = media ? "post-media/" + v4() + media.name : undefined;
    if (media && mediaPath) storageService.upload(mediaPath, media);
    const notifyId = v4();
    eventService.notifyOn(notifyId, (err) => err || "Post Created", [userId]);
    postService.createPost(
      {
        content,
        mediaPath,
        authorId: platformUserId,
      },
      notifyId
    );
    redirect(appPath("/profile"));
  }
);
