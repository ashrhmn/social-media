"use client";

import { basename } from "path";
import React, { useEffect, useState } from "react";
import { getFileUrls } from "./actions";

const AttachmentBubble = ({ paths }: any) => {
  const [urlMap, setUrlMap] = useState({} as Record<string, string>);
  useEffect(() => {
    getFileUrls(paths).then(setUrlMap);
  }, [paths]);
  if (Object.keys(urlMap).length === 0)
    return (
      <div className="chat-bubble flex flex-col mt-1 w-56 animate-pulse" />
    );
  return (
    <div className="chat-bubble flex flex-col mt-1">
      {Object.entries(urlMap).map(([path, url]) => {
        const name = basename(path);
        return (
          <a
            key={path}
            className="link cursor-pointer"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {name.length > 20
              ? name.slice(0, 10) +
                "..." +
                name.slice(name.length - 10, name.length)
              : name}
          </a>
        );
      })}
    </div>
  );
};

export default AttachmentBubble;
