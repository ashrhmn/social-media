"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import { useInViewport } from "react-in-viewport";

const ChatView = ({
  messages: initialMessages,
  platformUser,
  userMap,
  avatarFileMap,
  getMessageCount,
  getMessages,
  initialLoadCount,
}: any) => {
  const [take, setTake] = useState(initialLoadCount as number);
  const [messages, setMessages] = useState(initialMessages);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    getMessageCount().then(setMessageCount);
  }, [getMessageCount]);

  useEffect(() => {
    getMessages(take).then(setMessages);
  }, [getMessages, take]);

  const loadingRef = useRef<HTMLParagraphElement>(null);
  const { inViewport } = useInViewport(loadingRef);

  useEffect(() => {
    if (inViewport) {
      setTake((prev) => prev + initialLoadCount);
    }
  }, [inViewport, initialLoadCount]);

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
      {messageCount > messages.length && <p ref={loadingRef}>Loading...</p>}
    </ul>
  );
};

export default ChatView;
