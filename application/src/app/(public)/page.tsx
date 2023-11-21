import { getAuthUser } from "@/lib/auth";
import React from "react";

const Home = async () => {
  const { loginUrl, user } = await getAuthUser();
  console.log({ user });
  return (
    <h1 className="text-center font-bold text-3xl">
      Homepage with no auth required
    </h1>
  );
};

export default Home;
