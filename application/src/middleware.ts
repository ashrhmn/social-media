import { NextRequest, NextResponse } from "next/server";
import { appPath } from "./utils/path.utils";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Store current request pathname in a custom header
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set(
    "x-origin",
    process.env.ORIGIN_URL || request.nextUrl.origin
  );
  requestHeaders.set("x-protocol", request.nextUrl.protocol);
  requestHeaders.set(
    "x-auth-callback-url",
    `${request.nextUrl.origin}${appPath("/api/auth-callback")}?next=${appPath(
      request.nextUrl.pathname
    )}`
  );
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
