"use client";

import FormSubmitButton from "@/app/components/FormSubmitButton";
import SelectInput from "@/app/components/SelectInput";
import TextArea from "@/app/components/TextArea";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { handleCreateMessage } from "../actions";

const NewMessageForm = ({ users, platformUserId, authUserMap }: any) => {
  const [selectedUser, setSelectedUser] = useState<any>("null");
  const [errors, action] = useFormState(handleCreateMessage, {});
  return (
    <form action={action}>
      <input
        type="text"
        name="receiverAuthId"
        defaultValue={authUserMap[selectedUser?.email]?.id}
        readOnly
      />
      <input type="text" name="userId" value={platformUserId} hidden readOnly />
      <SelectInput
        name="receiverId"
        error={errors.receiverId}
        label="Select a user"
        defaultValue={selectedUser}
        onChange={(e) =>
          setSelectedUser(users.find((u: any) => u.id === e.target.value))
        }
      >
        <option disabled value={"null"}>
          Pick One
        </option>
        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.firstName + " " + user.lastName}
          </option>
        ))}
      </SelectInput>
      <TextArea error={errors.message} name="message" label="Message" />
      <FormSubmitButton>Send Message</FormSubmitButton>
    </form>
  );
};

export default NewMessageForm;
