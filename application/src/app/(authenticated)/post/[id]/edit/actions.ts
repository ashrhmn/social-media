"use server";

import { createFormHandler } from "@/utils/zod.utils";
import { editPostFormSchema } from "./formSchema";
import { v4 } from "uuid";
import { StorageService } from "@/services/StorageService";
import Container from "typedi";
import { EventService } from "@/services/EventService";
import { PostService } from "@/services/PostService";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { appPath } from "@/utils/path.utils";

const storageService = Container.get(StorageService);
const eventService = Container.get(EventService);
const postService = Container.get(PostService);

export const handleEditPost = createFormHandler(
  editPostFormSchema,
  ({ media, userId, postId, content }) => {
    const mediaPath = media ? "post-media/" + v4() + media.name : undefined;
    if (media && mediaPath) storageService.upload(mediaPath, media);
    const notifyId = v4();
    eventService.notifyOn(notifyId, (err) => err || "Post Updated", [userId]);
    postService.updatePost(
      {
        where: { id: postId },
        data: { content: content || null, mediaPath },
      },
      notifyId
    );
    return {};
  }
);

export const handleDeletePostMedia = createFormHandler(
  z.object({ postId: z.string().uuid(), userId: z.string().uuid() }),
  ({ postId, userId }) => {
    const notifyId = v4();
    eventService.notifyOn(notifyId, (err) => err || "Media Deleted", [userId]);
    postService.updatePost(
      {
        where: { id: postId },
        data: { mediaPath: null },
      },
      notifyId
    );
    revalidatePath(appPath(`/post/${postId}/edit`));
    return {};
  }
);
