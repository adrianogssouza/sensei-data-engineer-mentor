import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getPrivateAccessEnv, getPublicEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

const PRIVATE_ACCESS_USERNAME = "sensei";

function isPrivateAccessPath(pathname: string): boolean {
  return (
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/api/chat") ||
    pathname.startsWith("/api/ai")
  );
}

function getUnauthorizedResponse(request: NextRequest): NextResponse {
  const headers = {
    "WWW-Authenticate": 'Basic realm="SENSEI"',
  };

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "Private access required." },
      { status: 401, headers },
    );
  }

  return new NextResponse("Private access required.", {
    status: 401,
    headers,
  });
}

function hasPrivateAccess(request: NextRequest): boolean {
  const { SENSEI_PRIVATE_ACCESS_PASSWORD } = getPrivateAccessEnv();

  if (
    !SENSEI_PRIVATE_ACCESS_PASSWORD ||
    !isPrivateAccessPath(request.nextUrl.pathname)
  ) {
    return true;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return (
      username === PRIVATE_ACCESS_USERNAME &&
      password === SENSEI_PRIVATE_ACCESS_PASSWORD
    );
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  if (!hasPrivateAccess(request)) {
    return getUnauthorizedResponse(request);
  }

  let response = NextResponse.next({
    request,
  });

  const env = getPublicEnv();
  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("message", "Please log in to continue.");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/api/chat/:path*",
    "/api/ai/:path*",
    "/api/documents",
    "/api/documents/:path*",
  ],
};
