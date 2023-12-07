import { getAuthUser } from "@/lib/auth";
import { UserService } from "@/services/UserService";
import { redirect } from "next/navigation";
import React from "react";
import Container from "typedi";
import EditProfileForm from "./EditProfileForm";
import { StorageService } from "@/services/StorageService";
import Link from "next/link";
import Button from "@/app/components/Button";
import { appPath } from "@/utils/path.utils";

const userService = Container.get(UserService);
const storageService = Container.get(StorageService);

const EditProfilePage = async () => {
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => null);
  if (!platformUser) redirect(appPath("/complete-sign-up"));
  const avatarUrl = !platformUser.avatarPath
    ? undefined
    : await storageService.getFileUrl(platformUser.avatarPath);
  return (
    <div className="p-3">
      <h1 className="text-xl font-bold">Edit Profile</h1>
      <EditProfileForm
        firstName={platformUser.firstName}
        lastName={platformUser.lastName}
        gender={platformUser.gender}
        dateOfBirth={platformUser.dateOfBirth}
        bio={platformUser.bio}
        website={platformUser.website}
        platformUserId={platformUser.id}
        userId={user.sub}
        avatarUrl={avatarUrl}
      />
      <Link href="/profile">
        <Button className="w-full">Back to Profile</Button>
      </Link>
    </div>
  );
};

export default EditProfilePage;
