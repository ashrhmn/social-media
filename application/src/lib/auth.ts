"use server";

import { AppConfig } from "@/config";
import { AuthService } from "@/services/AuthService";
import { cookies, headers } from "next/headers";
import Container from "typedi";

export const getAuthUser = async () => {
  const authService = Container.get(AuthService);
  const headerCollection = headers();
  const authCallbackUrl = headerCollection.get("x-auth-callback-url");
  const protocol = headerCollection.get("x-protocol");
  const authenticatorUrl = process.env.AUTHENTICATOR_URL || "localhost:3002"; // auth.deepchainlabs.com
  const loginUrl = `${protocol}//${authenticatorUrl}/login?callback=true&next=${authCallbackUrl}`;
  const token = cookies().get(AppConfig.TOKEN_COOKIE_KEY)?.value;
  if (!token) return { user: null, loginUrl };
  const user: any = await authService.getUserByToken(token).catch(() => null);
  return { user, loginUrl };
};
