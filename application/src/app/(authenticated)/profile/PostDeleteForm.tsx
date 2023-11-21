"use client";

import FormSubmitButton from "@/app/components/FormSubmitButton";
import React from "react";
import { useFormState } from "react-dom";
import { handleDeletePost } from "./actions";
import { DeleteIcon } from "@/app/components/Svgs";

const PostDeleteForm = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const [error, action] = useFormState(handleDeletePost, {});
  return (
    <form
      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100"
      action={action}
    >
      <input hidden type="text" name="postId" defaultValue={postId} />
      <input hidden type="text" name="userId" defaultValue={userId} />
      <FormSubmitButton
        className="hover:bg-red-600 hover:text-white"
        variant="ghost"
      >
        <DeleteIcon className="w-6 h-6" />
      </FormSubmitButton>
    </form>
  );
};

export default PostDeleteForm;
