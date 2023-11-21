/* eslint-disable @next/next/no-img-element */
import Timestamp from "@/app/components/Timestamp";
import React from "react";
import PostDeleteForm from "./PostDeleteForm";
import Link from "next/link";
import Button from "@/app/components/Button";
import { EditIcon } from "@/app/components/Svgs";

const PostItem = ({
  firstName,
  lastName,
  post,
  username,
  mediaUrl,
  userId,
  publicView = false,
}: {
  firstName: string;
  lastName: string;
  username: string;
  post: any;
  mediaUrl?: string;
  userId: string;
  publicView?: boolean;
}) => {
  return (
    <div className="border group my-5 p-5 rounded relative" key={post.id}>
      {!publicView && (
        <>
          <PostDeleteForm postId={post.id} userId={userId} />
          <Link href={`/post/${post.id}/edit`}>
            <Button
              variant="ghost"
              className="absolute right-12 top-0 opacity-0 group-hover:opacity-100"
            >
              <EditIcon className="w-6 h-6" />
            </Button>
          </Link>
        </>
      )}
      <h2 className="flex gap-2 mt-4">
        <Link href={`/profile/${username}`}>
          <span className="font-bold">
            {firstName} {lastName}
          </span>
        </Link>
        <span className="text-base opacity-50">@{username}</span>
        <span className="text-base opacity-50">
          <Timestamp timeStamp={post.createdAt} />
        </span>
      </h2>
      <p>{post.content}</p>
      {mediaUrl && <img className="mt-3" src={mediaUrl} alt={post.title} />}
    </div>
  );
};

export default PostItem;
