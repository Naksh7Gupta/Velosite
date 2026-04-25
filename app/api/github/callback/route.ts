import { NextResponse } from "next/server";
import { TOKEN_COOKIE_KEY } from "@/lib/github";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const callbackPath = url.searchParams.get("state") ?? "/";

  if (!code) {
    return NextResponse.redirect(new URL("/?github=missing_code", url.origin));
  }

  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return NextResponse.redirect(new URL("/?github=missing_env", url.origin));
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/?github=oauth_failed", url.origin));
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token || tokenData.error) {
    return NextResponse.redirect(new URL("/?github=oauth_denied", url.origin));
  }

  const response = NextResponse.redirect(new URL(callbackPath, url.origin));
  response.cookies.set({
    name: TOKEN_COOKIE_KEY,
    value: tokenData.access_token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
