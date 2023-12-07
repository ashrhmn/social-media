import { getAuthUser } from "@/lib/auth";
import React from "react";
import SignUpForm from "./SignUpForm";
import { redirect } from "next/navigation";
import Container from "typedi";
import { UserService } from "@/services/UserService";
import GenericNotification from "@/app/components/GenericNotification";
import { appPath } from "@/utils/path.utils";

const userService = Container.get(UserService);

const CompleteSignUpPage = async () => {
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => null);
  if (platformUser) redirect(appPath("/profile"));
  return (
    <div className="p-3">
      <h1 className="text-xl font-bold text-center">Complete SignUp</h1>
      <SignUpForm
        email={user.user.email}
        username={user.user.username}
        userId={user.sub}
      />
    </div>
  );
};

export default CompleteSignUpPage;
