"use client";

import FormSubmitButton from "@/app/components/FormSubmitButton";
import Input from "@/app/components/Input";
import SelectInput from "@/app/components/SelectInput";
import React from "react";
import { useFormState } from "react-dom";
import { handleUpdateProfile } from "./actions";
import ProfileImageInput from "./ProfileImageInput";

const EditProfileForm = ({
  dateOfBirth,
  firstName,
  lastName,
  userId,
  bio,
  gender,
  website,
  platformUserId,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth: string;
  bio?: string;
  website?: string;
  userId: string;
  platformUserId: string;
  avatarUrl?: string;
}) => {
  const [error, action] = useFormState(handleUpdateProfile, {});
  return (
    <form action={action}>
      <input hidden type="text" name="userId" readOnly defaultValue={userId} />
      <input
        hidden
        type="text"
        name="platformUserId"
        readOnly
        defaultValue={platformUserId}
      />
      <ProfileImageInput error={error.avatar} initialImageUrl={avatarUrl} />
      <Input
        label="First Name"
        name="firstName"
        defaultValue={firstName}
        error={error.firstName}
      />
      <Input
        label="Last Name"
        name="lastName"
        defaultValue={lastName}
        error={error.lastName}
      />
      <Input
        label="Date of Birth"
        name="dateOfBirth"
        defaultValue={dateOfBirth.split("T")[0]}
        type="date"
        error={error.dateOfBirth}
      />
      <Input label="Bio" name="bio" defaultValue={bio} error={error.bio} />
      <Input
        label="Website"
        name="website"
        defaultValue={website}
        error={error.website}
      />
      <SelectInput
        label="Gender"
        name="gender"
        defaultValue={gender || "UNDEFINED"}
        error={error.gender}
      >
        <option disabled value="UNDEFINED">
          Pick One
        </option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </SelectInput>
      <FormSubmitButton className="w-full btn-primary">
        Update Profile
      </FormSubmitButton>
    </form>
  );
};

export default EditProfileForm;
