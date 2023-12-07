"use server";

import { getAuthUser } from "@/lib/auth";
import { ConversationService } from "@/services/ConversationService";
import { EventService } from "@/services/EventService";
import { StorageService } from "@/services/StorageService";
import { UserService } from "@/services/UserService";
import { appPath } from "@/utils/path.utils";
import { createFormHandler } from "@/utils/zod.utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import Container from "typedi";
import { v4 } from "uuid";
import { z } from "zod";

const conversationService = Container.get(ConversationService);
const eventService = Container.get(EventService);
const userService = Container.get(UserService);
const storageService = Container.get(StorageService);

export const handleCreateMessage = createFormHandler(
  z.object({
    userId: z.string().uuid(),
    receiverId: z.string().uuid(),
    receiverAuthId: z.string().uuid(),
    message: z.string().trim().min(1, "Message is required"),
  }),
  async ({ message, receiverId, userId, receiverAuthId }, _, formData) => {
    const rawAttachments = formData.getAll("attachments") as File[];
    const attachments = rawAttachments.filter((a) => a.size > 0 && !!a.name);
    if (attachments.length > 10)
      return { error: "Maximum 10 attachments allowed" };
    if (attachments.some((a) => a.size > 10_000_000))
      return {
        error: "Maximum 10MB per attachment allowed",
      };
    const attachmentWithPaths = attachments.map((a) => ({
      path: "group-message-attachments/" + v4() + "/" + a.name,
      file: a,
    }));

    attachmentWithPaths.map(({ file, path }) =>
      storageService.upload(path, file)
    );
    const notifyId = v4();
    eventService.emitSocketOn(
      notifyId,
      {
        event: "NEW_MESSAGE",
        payload: {},
      },
      [receiverAuthId]
    );
    conversationService.createMessage(
      {
        senderId: userId,
        receiverId,
        content: message,
        attachmentPaths: attachmentWithPaths.map(({ path }) => path),
      },
      notifyId
    );
    revalidatePath(appPath(`/conversations/`), "page");
    const headerCollection = headers();
    const pathname = headerCollection.get("x-pathname");
    if (pathname === appPath("/conversations/new-message"))
      redirect(appPath(`/conversations/${receiverId}`));
    return {};
  }
);

export const revalidate = async () => {
  revalidatePath(appPath(`/conversations/`), "page");
};

export const getPlatformUserWithOtherUsers = async (whereOptions: any = {}) => {
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => redirect(appPath("/complete-sign-up")));
  const users = await userService.findManyUsers({
    where: {
      id: {
        not: platformUser.id,
      },
      ...whereOptions,
    },
  });
  return { users, platformUser };
};

export const handleCreateGroup = createFormHandler(
  z
    .object({
      platformUserId: z.string().uuid(),
      groupName: z.string().trim().min(1, "Group name is Required"),
      message: z.string().trim().min(1, "Message is Required"),
    })
    .passthrough(),
  async ({ platformUserId: senderId, groupName, message, ...users }) => {
    const participantIds = Object.keys(users).filter((k) => !k.startsWith("$"));
    if (participantIds.length <= 1)
      return { platformUserId: "At least 2 users are required" };
    const notifyId = v4();
    conversationService.createGroupWithMessage(
      {
        groupName,
        messageContent: message,
        participantIds,
        senderId,
      },
      notifyId
    );

    redirect(appPath(`/conversations/`));
    return {};
  }
);

export const handleCreateGroupMessage = createFormHandler(
  z.object({
    userId: z.string().uuid(),
    groupId: z.string().uuid(),
    message: z.string().trim().min(1, "Message is required"),
  }),
  async ({ groupId, userId, message }, _, formData) => {
    const rawAttachments = formData.getAll("attachments") as File[];
    const attachments = rawAttachments.filter((a) => a.size > 0 && !!a.name);
    if (attachments.length > 10)
      return { error: "Maximum 10 attachments allowed" };
    if (attachments.some((a) => a.size > 10_000_000))
      return {
        error: "Maximum 10MB per attachment allowed",
      };
    const attachmentWithPaths = attachments.map((a) => ({
      path: "group-message-attachments/" + v4() + "/" + a.name,
      file: a,
    }));

    attachmentWithPaths.map(({ file, path }) =>
      storageService.upload(path, file)
    );

    const notifyId = v4();
    const participantAuthIds = await cache(async () => {
      const participants = await conversationService.getGroupParticipantsById(
        groupId
      );
      const authUserIdMap = await userService.getAuthUserIdsFromPlatformUserIds(
        participants
      );
      return Array.from(new Set(Object.values(authUserIdMap)));
    })();
    eventService.emitSocketOn(
      notifyId,
      {
        event: "NEW_MESSAGE",
        payload: {},
      },
      participantAuthIds as any
    );
    conversationService.createMessage(
      {
        senderId: userId,
        groupId,
        content: message,
        attachmentPaths: attachmentWithPaths.map(({ path }) => path),
      },
      notifyId
    );
    return {};
  }
);

export const getFileUrls = storageService.getFileUrls.bind(storageService);
