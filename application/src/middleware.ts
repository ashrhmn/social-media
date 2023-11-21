import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Store current request pathname in a custom header
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-origin", request.nextUrl.origin);
  requestHeaders.set("x-protocol", request.nextUrl.protocol);
  requestHeaders.set(
    "x-auth-callback-url",
    `${request.nextUrl.origin}/api/auth-callback?next=${request.nextUrl.pathname}`
  );
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
