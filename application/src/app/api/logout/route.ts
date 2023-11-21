import { AppConfig } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/", request.nextUrl));
  res.cookies.delete(AppConfig.TOKEN_COOKIE_KEY);
  return res;
}
