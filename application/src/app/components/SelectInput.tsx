import React, { SelectHTMLAttributes, HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classname.utils";

export const selectVariant = cva("select select-bordered", {
  variants: {
    variant: {
      default: "",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof selectVariant> & { error?: string; label: string };

const SelectInput = ({
  className,
  variant,
  error,
  label,
  ...props
}: SelectProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className={cn(selectVariant({ className, variant }))}
        {...props}
      />
      {error && <label className="label text-error">{error}</label>}
    </div>
  );
};

export default SelectInput;
