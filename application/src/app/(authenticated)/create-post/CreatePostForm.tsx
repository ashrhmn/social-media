"use client";

import TextArea from "@/app/components/TextArea";
import React from "react";
import CreatePostImageInput from "./CreatePostImageInput";
import FormSubmitButton from "@/app/components/FormSubmitButton";
import { useFormState } from "react-dom";
import { handleCreatePost } from "./actions";

const CreatePostForm = ({
  platformUserId,
  userId,
  avatarUrl,
}: {
  userId: string;
  platformUserId: string;
  avatarUrl?: string;
}) => {
  const [error, action] = useFormState(handleCreatePost, {});
  return (
    <form action={action}>
      <input hidden readOnly type="text" name="userId" defaultValue={userId} />
      <input
        hidden
        readOnly
        type="text"
        name="platformUserId"
        defaultValue={platformUserId}
      />
      <TextArea name="content" label="" error={error.content} />
      <CreatePostImageInput error={error.media} />
      <FormSubmitButton className="w-full btn-primary">Create</FormSubmitButton>
    </form>
  );
};

export default CreatePostForm;
