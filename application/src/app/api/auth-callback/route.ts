import "reflect-metadata";
import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";
import Container from "typedi";
import { parse } from "url";
import { AppConfig } from "@/config";

const authService = Container.get(AuthService);

export async function GET(request: Request) {
  const url = parse(request.url, true);
  const token = url.query.token;
  if (typeof token !== "string")
    return NextResponse.json({ err: "No token provided" });
  const user = await authService.getUserByToken(token).catch((err) => {
    // console.error(err);
    return null;
  });
  if (!user) return NextResponse.json({ err: "Invalid token" });
  ////////
  // create user
  // redirect("complete-profile")
  const next = url.query.next;
  const res = NextResponse.redirect(
    new URL(typeof next === "string" ? next : "/", request.url)
  );
  res.headers.append(
    "Set-Cookie",
    `${
      AppConfig.TOKEN_COOKIE_KEY
    }=${token}; Path=/; HttpOnly; SameSite=Strict; ${
      AppConfig.NODE_ENV === "production" ? "Secure=true;" : ""
    }`
  );
  return res;
}
