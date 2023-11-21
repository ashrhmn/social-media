import React, { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classname.utils";

export const buttonVariant = cva("btn btn-sm my-2", {
  variants: {
    variant: {
      default: "",
      disabled: "btn-disabled",
      ghost: "btn-ghost",
      error: "btn-error",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariant>;

const Button = ({ className, variant, ...props }: ButtonProps) => {
  return (
    <button className={cn(buttonVariant({ className, variant }))} {...props} />
  );
};

export default Button;
