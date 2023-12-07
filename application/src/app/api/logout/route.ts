import { AppConfig } from "@/config";
import { appPath } from "@/utils/path.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL(appPath("/"), request.nextUrl));
  res.cookies.delete(AppConfig.TOKEN_COOKIE_KEY);
  return res;
}
