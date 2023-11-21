/* eslint-disable @next/next/no-img-element */
import { PostService } from "@/services/PostService";
import { StorageService } from "@/services/StorageService";
import React from "react";
import Container from "typedi";
import PostItem from "./PostItem";

const postService = Container.get(PostService);
const storageService = Container.get(StorageService);

const PostList = async ({
  platformUserId,
  firstName,
  lastName,
  username,
  userId,
  publicView = false,
}: {
  platformUserId: string;
  firstName: string;
  lastName: string;
  username: string;
  userId: string;
  publicView?: boolean;
}) => {
  const posts = await postService.findManyPosts({
    where: { authorId: platformUserId },
    orderBy: { createdAt: "desc" },
  });
  const urlMap = await storageService.getFileUrls(
    posts.map((post: any) => post.mediaPath).filter(Boolean)
  );
  return (
    <div>
      {posts.map((post: any) => (
        <PostItem
          key={post.id}
          firstName={firstName}
          lastName={lastName}
          username={username}
          post={post}
          mediaUrl={urlMap[post.mediaPath]}
          userId={userId}
          publicView={publicView}
        />
      ))}
    </div>
  );
};

export default PostList;
