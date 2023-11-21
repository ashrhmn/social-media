import { getAuthUser } from "@/lib/auth";
import { ConversationService } from "@/services/ConversationService";
import { UserService } from "@/services/UserService";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Container from "typedi";
import { z } from "zod";
import ChatView from "../../ChatView";
import { StorageService } from "@/services/StorageService";
import SendGroupMessageForm from "./SendGroupMessageForm";
import SocketListener from "../../SocketListener";

const userService = Container.get(UserService);
const conversationService = Container.get(ConversationService);
const storageService = Container.get(StorageService);

const GroupConversationPage = async ({ params: { groupId } }: any) => {
  if (!z.string().uuid().safeParse(groupId).success) return notFound();
  const groupDetails = await conversationService
    .getGroupDetailsByIds([groupId])
    .then((res) => res[groupId]);
  if (!groupDetails) return notFound();
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => redirect("/complete-sign-up"));
  const groupParticipants = await conversationService.getGroupParticipantsById(
    groupId
  );
  if (!groupParticipants.includes(platformUser.id)) return notFound();
  const userMap = await userService.getUsersByIds(groupParticipants);

  const avatarFileMap = await storageService.getFileUrls(
    Object.values(userMap)
      .map((u: any) => u.avatarPath)
      .filter(Boolean)
  );

  const initialLoadCount = 10;
  const findOptions = {
    where: { groupId },
  };
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
      <h1 className="font-bold text-2xl">{groupDetails.name}</h1>
      <ChatView
        messages={messages}
        platformUser={platformUser}
        userMap={userMap}
        avatarFileMap={avatarFileMap}
        getMessageCount={getMessageCount}
        getMessages={getMessages}
        initialLoadCount={initialLoadCount}
      />
      <SendGroupMessageForm userId={platformUser.id} groupId={groupId} />
      <SocketListener />
    </div>
  );
};

export default GroupConversationPage;
