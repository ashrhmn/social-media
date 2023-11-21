import React from "react";
import Button, { ButtonProps } from "./Button";
import { useFormStatus } from "react-dom";

const FormSubmitButton = (props: ButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={pending ? "disabled" : "default"}
      {...props}
    />
  );
};

export default FormSubmitButton;
