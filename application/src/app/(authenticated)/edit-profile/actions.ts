"use server";

import { createFormHandler } from "@/utils/zod.utils";
import { updateProfileFormSchema } from "./formSchema";
import { UserService } from "@/services/UserService";
import Container from "typedi";
import { v4 } from "uuid";
import { EventService } from "@/services/EventService";
import { StorageService } from "@/services/StorageService";

const userService = Container.get(UserService);
const eventService = Container.get(EventService);
const storageService = Container.get(StorageService);

export const handleUpdateProfile = createFormHandler(
  updateProfileFormSchema,
  ({
    dateOfBirth,
    firstName,
    gender,
    lastName,
    userId,
    bio,
    website,
    platformUserId,
    avatar,
  }) => {
    const avatarPath = avatar
      ? "user-profile-image/" + v4() + avatar.name
      : undefined;
    if (avatar && avatarPath) {
      storageService.upload(avatarPath, avatar);
    }
    const notifyId = v4();
    eventService.notifyOn(notifyId, (err) => err || "Profile Updated", [
      userId,
    ]);
    userService.updateUser(
      {
        where: { id: platformUserId },
        data: {
          dateOfBirth,
          firstName,
          gender,
          lastName,
          bio,
          website,
          avatarPath,
        },
      },
      notifyId
    );
    return {};
  }
);
