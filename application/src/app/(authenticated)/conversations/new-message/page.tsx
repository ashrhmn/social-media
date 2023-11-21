import React from "react";
import NewMessageForm from "./NewMessageForm";
import { getPlatformUserWithOtherUsers } from "../actions";
import Container from "typedi";
import { AuthUserService } from "@/services/AuthUserService";

const userAuthService = Container.get(AuthUserService);

const NewMessagePage = async () => {
  const { platformUser, users } = await getPlatformUserWithOtherUsers();
  const authUserMap = await userAuthService
    .getAllAuthUsers({
      where: { email: { in: users.map((u: any) => u.email) } },
      select: { email: true, id: true },
    })
    .then((res) =>
      res.data.reduce((acc: any, curr: any) => {
        acc[curr.email] = curr;
        return acc;
      }, {} as any)
    );
  return (
    <div className="p-3">
      <h1 className="font-bold text-2xl">Compose New Message</h1>
      <NewMessageForm
        users={users.map(({ id, firstName, lastName, email }: any) => ({
          id,
          firstName,
          lastName,
          email,
        }))}
        platformUserId={platformUser.id}
        authUserMap={authUserMap}
      />
    </div>
  );
};

export default NewMessagePage;
