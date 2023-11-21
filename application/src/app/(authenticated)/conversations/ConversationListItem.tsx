import Timestamp from "@/app/components/Timestamp";
import Link from "next/link";
import React from "react";

const ConversationListItem = ({
  conversation: c,
  userMap,
  groupDetailsMap,
  userId,
}: any) => {
  const title = (
    groupDetailsMap[c.group_id]?.name ||
    (userMap[c.user_id]?.firstName || "") +
      " " +
      (userMap[c.user_id]?.lastName || "")
  ).trim();
  const lastSender =
    c.last_sender === userId ? "You" : userMap[c.last_sender]?.firstName;
  return (
    <Link
      key={c.user_id || c.group_id}
      href={`/conversations/${c.user_id || "group/" + c.group_id}`}
    >
      <li className="w-full bg-base-200 h-20 my-2 p-3 rounded cursor-pointer">
        <div className="flex justify-between">
          <h1 className="font-bold">{title}</h1>
          <h3 suppressHydrationWarning>
            <Timestamp timeStamp={c.last_at} />
          </h3>
        </div>
        <p>
          <span className="font-semibold">{lastSender}</span>: {c.last_message}
        </p>
      </li>
    </Link>
  );
};

export default ConversationListItem;
