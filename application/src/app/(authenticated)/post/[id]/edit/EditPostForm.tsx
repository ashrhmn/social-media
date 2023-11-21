"use client";

import TextArea from "@/app/components/TextArea";
import React from "react";
import FormSubmitButton from "@/app/components/FormSubmitButton";
import { useFormState } from "react-dom";
import { handleEditPost } from "./actions";
import EditPostImageInput from "./EditPostImageInput";

const EditPostForm = ({
  platformUserId,
  userId,
  avatarUrl,
  postId,
  content,
  mediaUrl,
}: {
  userId: string;
  postId: string;
  platformUserId: string;
  avatarUrl?: string;
  content?: string;
  mediaUrl?: string;
}) => {
  const [error, action] = useFormState(handleEditPost, {});
  return (
    <form action={action}>
      <input hidden readOnly type="text" name="postId" defaultValue={postId} />
      <input hidden readOnly type="text" name="userId" defaultValue={userId} />
      <input
        hidden
        readOnly
        type="text"
        name="existingMediaUrl"
        defaultValue={mediaUrl}
      />
      <input
        hidden
        readOnly
        type="text"
        name="platformUserId"
        defaultValue={platformUserId}
      />
      <TextArea
        name="content"
        label=""
        defaultValue={content}
        error={error.content}
      />
      <EditPostImageInput initialImageUrl={mediaUrl} error={error.media} />
      <FormSubmitButton className="w-full btn-primary">Update</FormSubmitButton>
    </form>
  );
};

export default EditPostForm;
