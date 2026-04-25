import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const callbackPath = searchParams.get("callback") ?? "/";

  if (!process.env.GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_ID environment variable." },
      { status: 500 },
    );
  }

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", `${origin}/api/github/callback`);
  githubAuthUrl.searchParams.set("scope", "read:user user:email repo");
  githubAuthUrl.searchParams.set("state", callbackPath);

  return NextResponse.redirect(githubAuthUrl);
}
