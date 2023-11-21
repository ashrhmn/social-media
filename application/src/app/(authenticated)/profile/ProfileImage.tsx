/* eslint-disable @next/next/no-img-element */
import { StorageService } from "@/services/StorageService";
import React from "react";
import Container from "typedi";

const storageService = Container.get(StorageService);

const ProfileImage = async ({
  avatarPath,
  username,
}: {
  avatarPath?: string;
  username: string;
}) => {
  const avatarUrl = !avatarPath
    ? undefined
    : await storageService.getFileUrl(avatarPath);
  return (
    <img
      className="w-28 h-28 rounded-full object-cover"
      src={avatarUrl || "/static/empty-avatar.png"}
      alt={username + " avatar"}
    />
  );
};

export default ProfileImage;
