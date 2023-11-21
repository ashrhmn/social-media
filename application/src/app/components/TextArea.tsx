import React, { TextareaHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classname.utils";

export const textAreaVariant = cva("textarea textarea-bordered w-full", {
  variants: {
    variant: {
      default: "",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
} & VariantProps<typeof textAreaVariant>;

const TextArea = ({
  label,
  variant,
  className,
  error,
  ...textAreaAttributes
}: TextAreaProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        className={cn(textAreaVariant({ className, variant }))}
        {...textAreaAttributes}
      ></textarea>
      {error && <label className="label text-error">{error}</label>}
    </div>
  );
};

export default TextArea;
