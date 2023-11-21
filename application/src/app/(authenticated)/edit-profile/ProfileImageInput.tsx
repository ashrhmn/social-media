import ImageFilePreview from "@/app/components/ImageFilePreview";
import { CameraIcon } from "@/app/components/Svgs";
import React from "react";

const ProfileImageInput = ({
  error,
  initialImageUrl,
}: {
  error?: string;
  initialImageUrl?: string;
}) => {
  return (
    <>
      <input hidden id="edit-profile-avatar-input" type="file" name="avatar" />
      <ImageFilePreview
        initialImageUrl={initialImageUrl}
        className="h-20 w-20 rounded-full object-cover"
        inputElementId="edit-profile-avatar-input"
        emptyContainerProps={{
          className:
            "group rounded-full border w-20 h-20 flex justify-center items-center cursor-pointer",
          children: (
            <CameraIcon className="p-3 group-hover:text-gray-400 transition-all cursor-pointer" />
          ),
        }}
      />
      {error && <label className="label text-error">{error}</label>}
    </>
  );
};

export default ProfileImageInput;
