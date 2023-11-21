import React, { InputHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classname.utils";

export const inputVariant = cva("input input-bordered w-full", {
  variants: {
    variant: {
      default: "",
      disabled: "input-disabled",
      file: "file-input file-input-bordered",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
} & VariantProps<typeof inputVariant>;

const Input = ({
  label,
  variant,
  className,
  error,
  ...inputAttributes
}: InputProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        className={cn(inputVariant({ className, variant }))}
        type="text"
        {...inputAttributes}
      />
      {error && <label className="label text-error">{error}</label>}
    </div>
  );
};

export default Input;
