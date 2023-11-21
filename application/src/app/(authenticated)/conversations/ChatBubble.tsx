/* eslint-disable @next/next/no-img-element */

import Timestamp from "@/app/components/Timestamp";
import { basename } from "path";
import React from "react";
import AttachmentBubble from "./AttachmentBubble";
import Link from "next/link";

const ChatBubble = ({
  platformUser,
  userMap,
  avatarFileMap,
  message: m,
}: any) => {
  const chatSideClass =
    m.senderId === platformUser.id ? "chat-end" : "chat-start";
  const avatarUrl =
    (m.senderId === platformUser.id
      ? avatarFileMap[platformUser.avatarPath]
      : avatarFileMap[userMap?.[m.senderId]?.avatarPath]) ||
    "/static/empty-avatar.png";
  const sender = (
    m.senderId === platformUser.id
      ? "You"
      : (userMap?.[m.senderId]?.firstName || "") +
        " " +
        (userMap?.[m.senderId]?.lastName || "")
  ).trim();

  return (
    <ul key={m.id} className={`chat ${chatSideClass}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt={avatarUrl} src={avatarUrl} />
        </div>
      </div>
      <div className="chat-header">
        <Link href={`/profile/${m.senderId}`}>
          <span className="mx-3 cursor-pointer">{sender}</span>
        </Link>
        <time suppressHydrationWarning className="text-xs opacity-50">
          <Timestamp timeStamp={m.createdAt} />
        </time>
      </div>
      <div className="chat-bubble">{m.content}</div>
      {m?.attachmentPaths?.length > 0 && (
        <AttachmentBubble paths={m?.attachmentPaths} />
      )}
    </ul>
  );
};

export default ChatBubble;
