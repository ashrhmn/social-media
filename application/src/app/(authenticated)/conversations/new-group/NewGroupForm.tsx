"use client";

import React, { useEffect, useState } from "react";
import { getPlatformUserWithOtherUsers, handleCreateGroup } from "../actions";
import Input from "@/app/components/Input";
import FormSubmitButton from "@/app/components/FormSubmitButton";
import { useFormState } from "react-dom";
import TextArea from "@/app/components/TextArea";

const NewGroupForm = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({} as any);
  const [errors, action] = useFormState(handleCreateGroup, {});
  useEffect(() => {
    if (query)
      getPlatformUserWithOtherUsers({
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } },
        ],
      }).then(setResult);
    else getPlatformUserWithOtherUsers().then(setResult);
  }, [query]);
  return (
    <div className="">
      <Input
        className="input-sm"
        label="Search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <form className="mt-4" action={action}>
        <input
          type="text"
          name="platformUserId"
          defaultValue={result?.platformUser?.id}
          readOnly
          hidden
        />
        <div className="flex gap-3 flex-wrap">
          {result?.users?.map((user: any) => (
            <div className="flex gap-1 items-center" key={user.id}>
              <input type="checkbox" name={user.id} className="checkbox" />
              <span>
                {user.firstName} {user.lastName}
              </span>
            </div>
          ))}
          {errors.platformUserId && (
            <p className="text-error">{errors.platformUserId}</p>
          )}
        </div>
        <Input label="Group Name" name="groupName" error={errors.groupName} />
        <TextArea label="message" name="message" error={errors.message} />
        <FormSubmitButton>Create</FormSubmitButton>
      </form>
    </div>
  );
};

export default NewGroupForm;
