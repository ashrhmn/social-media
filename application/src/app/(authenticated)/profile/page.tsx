import { getAuthUser } from "@/lib/auth";
import { UserService } from "@/services/UserService";
import { redirect } from "next/navigation";
import React from "react";
import Container from "typedi";
import ProfileView from "./ProfileView";
import { appPath } from "@/utils/path.utils";

const userService = Container.get(UserService);

const ProfilePage = async () => {
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => redirect(appPath("/complete-sign-up")));

  return <ProfileView user={user} platformUser={platformUser} />;
};

export default ProfilePage;
