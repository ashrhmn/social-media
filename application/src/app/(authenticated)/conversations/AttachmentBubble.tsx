import { StorageService } from "@/services/StorageService";
import { basename } from "path";
import React from "react";
import Container from "typedi";

const storageService = Container.get(StorageService);

const AttachmentBubble = async ({ paths }: any) => {
  const urlMap = await storageService.getFileUrls(paths);
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
