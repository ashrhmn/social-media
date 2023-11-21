/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  HTMLAttributes,
  ImgHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";

export type ImageFilePreviewProps = ImgHTMLAttributes<HTMLImageElement> & {
  initialImageUrl?: string;
  inputElementId: string;
  emptyContainerProps?: HTMLAttributes<HTMLDivElement>;
};

const ImageFilePreview = ({
  inputElementId,
  emptyContainerProps,
  initialImageUrl,
  ...props
}: ImageFilePreviewProps) => {
  const [imgUrl, setImgUrl] = useState(initialImageUrl);
  const handleChange = useCallback(
    (e: Event) => {
      const inputElement = document.getElementById(
        inputElementId
      ) as HTMLInputElement | null;
      const file = inputElement?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        console.log();
        const reader = new FileReader();
        reader.onloadend = () => setImgUrl(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [inputElementId]
  );
  useEffect(() => {
    document
      .getElementById(inputElementId)
      ?.addEventListener("change", handleChange);
    return () => {
      document
        .getElementById(inputElementId)
        ?.removeEventListener("change", handleChange);
    };
  }, [handleChange, inputElementId]);
  const handleOpenInput = useCallback(() => {
    document.getElementById(inputElementId)?.click();
  }, [inputElementId]);
  if (!imgUrl)
    return <div onClick={handleOpenInput} {...emptyContainerProps} />;
  return (
    <img
      onClick={handleOpenInput}
      src={imgUrl}
      alt={inputElementId}
      {...props}
    />
  );
};

export default ImageFilePreview;
