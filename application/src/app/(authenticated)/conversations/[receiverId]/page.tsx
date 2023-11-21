/* eslint-disable @next/next/no-img-element */
import { getAuthUser } from "@/lib/auth";
import { ConversationService } from "@/services/ConversationService";
import { StorageService } from "@/services/StorageService";
import { UserService } from "@/services/UserService";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Container from "typedi";
import SendMessageForm from "./SendMessageForm";
import SocketListener from "../SocketListener";
import { AuthUserService } from "@/services/AuthUserService";
import ChatView from "../ChatView";

const userService = Container.get(UserService);
const conversationService = Container.get(ConversationService);
const storageService = Container.get(StorageService);
const authUserService = Container.get(AuthUserService);

const OneToOneConversationPage = async ({ params: { receiverId } }: any) => {
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => redirect("/complete-sign-up"));
  const receiverUser = await userService
    .findFirstUser({
      where: { id: receiverId },
    })
    .catch(() => null);
  if (!receiverUser) return notFound();
  const userMap = { [receiverId]: receiverUser } as any;
  const receiverAuthUser = await authUserService.getOneAuthUser({
    where: { email: receiverUser.email },
  });
  const avatarFileMap = await storageService.getFileUrls(
    [receiverUser.avatarPath, platformUser.avatarPath].filter(Boolean)
  );
  const findOptions = {
    where: {
      OR: [
        {
          senderId: platformUser.id,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: platformUser.id,
        },
      ],
    },
  };
  const initialLoadCount = 10;
  const getMessageCount = async () => {
    "use server";
    return await conversationService.countMessages(findOptions);
  };
  const getMessages = async (take: number) => {
    "use server";
    return await conversationService.findManyMessages({
      ...findOptions,
      orderBy: {
        createdAt: "desc",
      },
      take,
    });
  };

  const messages = await getMessages(initialLoadCount);

  return (
    <div className="p-3">
      <h1 className="font-bold text-2xl">
        {receiverUser.firstName} {receiverUser.lastName}
      </h1>
      <ChatView
        messages={messages}
        platformUser={platformUser}
        userMap={userMap}
        avatarFileMap={avatarFileMap}
        getMessageCount={getMessageCount}
        getMessages={getMessages}
        initialLoadCount={initialLoadCount}
      />
      <SendMessageForm
        userId={platformUser.id}
        receiverId={receiverId}
        receiverAuthId={receiverAuthUser.id}
      />
      <SocketListener />
    </div>
  );
};

export default OneToOneConversationPage;
