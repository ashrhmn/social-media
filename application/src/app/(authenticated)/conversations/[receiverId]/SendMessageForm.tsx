"use client";

import FormSubmitButton from "@/app/components/FormSubmitButton";
import TextArea from "@/app/components/TextArea";
import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { handleCreateMessage } from "../actions";
import SendMessageFormAttachment from "../SendMessageFormAttachment";

const SendMessageForm = ({ userId, receiverId, receiverAuthId }: any) => {
  const [errors, action] = useFormState(handleCreateMessage, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [key, setKey] = useState(false);
  return (
    <form
      ref={formRef}
      action={async (e) => {
        action(e);
        formRef.current?.reset();
        setKey((v) => !v);
      }}
    >
      <input type="text" name="userId" value={userId} hidden readOnly />
      <input type="text" name="receiverId" value={receiverId} hidden readOnly />
      <input
        type="text"
        name="receiverAuthId"
        value={receiverAuthId}
        hidden
        readOnly
      />
      {errors.error && <p className="text-error">{errors.error}</p>}
      <div suppressHydrationWarning className="flex items-center">
        <TextArea
          rows={3}
          className="w-[90%] h-16 resize-none"
          label=""
          name="message"
          error={errors.message}
        />
        <div className="flex flex-col items-center">
          <FormSubmitButton>Send</FormSubmitButton>
          <SendMessageFormAttachment key={`${key}`} />
        </div>
      </div>
    </form>
  );
};

export default SendMessageForm;
