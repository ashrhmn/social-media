"use server";

import { getAuthUser } from "@/lib/auth";
import { PostService } from "@/services/PostService";
import { UserService } from "@/services/UserService";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Container from "typedi";
import { z } from "zod";
import EditPostForm from "./EditPostForm";
import { StorageService } from "@/services/StorageService";
import Button from "@/app/components/Button";
import Link from "next/link";
import DeletePostMediaForm from "./DeletePostMediaForm";
import { appPath } from "@/utils/path.utils";

const postService = Container.get(PostService);
const userService = Container.get(UserService);
const storageService = Container.get(StorageService);

const EditPostPage = async ({ params: { id } }: any) => {
  if (!z.string().uuid().safeParse(id).success) throw notFound();
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => redirect(appPath("/complete-sign-up")));
  const post = await postService
    .findOnePost({ where: { id } })
    .catch(() => notFound());
  if (post.authorId !== platformUser.id) throw notFound();
  const avatarUrl = !platformUser.avatarPath
    ? undefined
    : await storageService.getFileUrl(platformUser.avatarPath);
  const mediaUrl = !post.mediaPath
    ? undefined
    : await storageService.getFileUrl(post.mediaPath);
  return (
    <div className="p-3">
      <h1 className="text-xl font-bold">Edit Post</h1>
      <EditPostForm
        platformUserId={platformUser.id}
        postId={id}
        userId={user.sub}
        content={post.content}
        mediaUrl={mediaUrl}
        avatarUrl={avatarUrl}
      />
      {!!mediaUrl && !!post.content && (
        <DeletePostMediaForm postId={post.id} userId={user.sub} />
      )}
      <Link href={"/profile"}>
        <Button className="w-full">Back</Button>
      </Link>
    </div>
  );
};

export default EditPostPage;
