"use client";

import Input from "@/app/components/Input";
import React from "react";
import { useFormState } from "react-dom";
import { handleCompleteSignUp } from "./actions";
import FormSubmitButton from "@/app/components/FormSubmitButton";

const SignUpForm = ({
  email,
  username,
  userId,
}: {
  email: string;
  username: string;
  userId: string;
}) => {
  const [error, action] = useFormState(handleCompleteSignUp, {});
  return (
    <form className="w-full" action={action}>
      <input name="userId" readOnly defaultValue={userId} hidden />
      <Input
        label="Email"
        name="email"
        readOnly
        defaultValue={email}
        variant="disabled"
      />
      <Input
        label="Username"
        name="username"
        readOnly
        defaultValue={username}
        variant="disabled"
      />
      <Input label="First Name" name="firstName" error={error.firstName} />
      <Input label="Last Name" name="lastName" error={error.lastName} />
      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        error={error.dateOfBirth}
      />
      <FormSubmitButton className="w-full">Sign Up</FormSubmitButton>
    </form>
  );
};

export default SignUpForm;
