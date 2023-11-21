"use client";

import FormSubmitButton from "@/app/components/FormSubmitButton";
import React from "react";
import { useFormState } from "react-dom";
import { handleDeletePostMedia } from "./actions";

const DeletePostMediaForm = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const [error, action] = useFormState(handleDeletePostMedia, {});
  return (
    <form action={action}>
      <input type="text" name="postId" value={postId} hidden readOnly />
      <input type="text" name="userId" value={userId} hidden readOnly />
      <FormSubmitButton variant="error" className="w-full">
        Delete Media Only
      </FormSubmitButton>
    </form>
  );
};

export default DeletePostMediaForm;
