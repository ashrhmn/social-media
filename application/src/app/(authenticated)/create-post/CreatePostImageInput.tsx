import ImageFilePreview from "@/app/components/ImageFilePreview";
import { CameraIcon } from "@/app/components/Svgs";
import React from "react";

const CreatePostImageInput = ({
  error,
  initialImageUrl,
}: {
  error?: string;
  initialImageUrl?: string;
}) => {
  return (
    <>
      <input hidden id="create-post-image-input" type="file" name="media" />
      <ImageFilePreview
        initialImageUrl={initialImageUrl}
        className="w-full aspect-square mt-10 object-contain"
        inputElementId="create-post-image-input"
        emptyContainerProps={{
          className:
            "group border w-full mt-10 aspect-square flex justify-center items-center cursor-pointer",
          children: (
            <CameraIcon className="p-3 max-h-40 group-hover:text-gray-400 transition-all cursor-pointer" />
          ),
        }}
      />
      {error && <label className="label text-error">{error}</label>}
    </>
  );
};

export default CreatePostImageInput;
