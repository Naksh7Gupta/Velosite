import { NextResponse } from "next/server";
import { getGithubTokenFromCookies, githubApiRequest } from "@/lib/github";

type GithubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
};

export async function GET() {
  const token = await getGithubTokenFromCookies();

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const user = await githubApiRequest<GithubUser>(token, "/user");
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
