import { NextResponse } from "next/server";
import { getGithubTokenFromCookies, githubApiRequest } from "@/lib/github";

type CreateRepoPayload = {
  name?: string;
  description?: string;
  private?: boolean;
};

type GithubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  owner: {
    login: string;
  };
};

export async function POST(request: Request) {
  const token = await getGithubTokenFromCookies();

  if (!token) {
    return NextResponse.json({ error: "Not authenticated with GitHub." }, { status: 401 });
  }

  const payload = (await request.json()) as CreateRepoPayload;

  if (!payload.name?.trim()) {
    return NextResponse.json({ error: "Repository name is required." }, { status: 400 });
  }

  try {
    const repo = await githubApiRequest<GithubRepo>(token, "/user/repos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        description: payload.description ?? "Generated with Velosite",
        private: payload.private ?? false,
        auto_init: false,
      }),
    });

    return NextResponse.json({ repo });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create repository." },
      { status: 500 },
    );
  }
}
