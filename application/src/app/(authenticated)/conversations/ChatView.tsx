import React from "react";
import ChatBubble from "./ChatBubble";

const ChatView = ({ messages, platformUser, userMap, avatarFileMap }: any) => {
  return (
    <ul className="flex flex-col-reverse h-[80dvh] overflow-y-auto">
      {messages.map((m: any) => (
        <ChatBubble
          key={m.id}
          platformUser={platformUser}
          userMap={userMap}
          avatarFileMap={avatarFileMap}
          message={m}
        />
      ))}
    </ul>
  );
};

export default ChatView;
