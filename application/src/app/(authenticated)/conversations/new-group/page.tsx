import React from "react";
import NewGroupForm from "./NewGroupForm";

const NewGroupMessage = () => {
  return (
    <div className="p-3">
      <h1 className="font-bold text-2xl">New Group</h1>
      <NewGroupForm />
    </div>
  );
};

export default NewGroupMessage;
