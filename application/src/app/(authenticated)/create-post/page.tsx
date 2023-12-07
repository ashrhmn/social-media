/* eslint-disable @next/next/no-img-element */
import { getAuthUser } from "@/lib/auth";
import { StorageService } from "@/services/StorageService";
import { UserService } from "@/services/UserService";
import { redirect } from "next/navigation";
import React from "react";
import Container from "typedi";
import CreatePostForm from "./CreatePostForm";
import Link from "next/link";
import Button from "@/app/components/Button";
import { appPath } from "@/utils/path.utils";

const userService = Container.get(UserService);
const storageService = Container.get(StorageService);

const CreatePostPage = async () => {
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
      <h1 className="text-2xl font-bold">Create New Post</h1>
      <CreatePostForm
        userId={user.sub}
        platformUserId={platformUser.id}
        avatarUrl={avatarUrl}
      />
      <Link href="/profile">
        <Button className="w-full">Back to Profile</Button>
      </Link>
    </div>
  );
};

export default CreatePostPage;
