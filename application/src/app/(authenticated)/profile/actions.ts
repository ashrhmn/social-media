"use server";

import { createFormHandler } from "@/utils/zod.utils";
import { z } from "zod";
import { v4 } from "uuid";
import Container from "typedi";
import { PostService } from "@/services/PostService";
import { EventService } from "@/services/EventService";
import { revalidatePath } from "next/cache";
import { appPath } from "@/utils/path.utils";

const postService = Container.get(PostService);
const eventService = Container.get(EventService);

export const handleDeletePost = createFormHandler(
  z.object({ postId: z.string().uuid(), userId: z.string().uuid() }),
  ({ postId, userId }) => {
    const notifyId = v4();
    eventService.notifyOn(notifyId, (err) => err || "Post Deleted", [userId]);
    postService.deletePost({ id: postId }, notifyId);
    revalidatePath(appPath("/profile"));
    return {};
  }
);
