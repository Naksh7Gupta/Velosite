import { NextResponse } from "next/server";
import { getGithubTokenFromCookies, githubApiRequest } from "@/lib/github";

type PushPayload = {
  owner?: string;
  repo?: string;
  code?: string;
  projectName?: string;
};

type GithubContent = {
  sha: string;
};

type GithubUser = {
  login: string;
};

function asBase64(content: string) {
  return Buffer.from(content, "utf8").toString("base64");
}

async function upsertFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  message: string,
  content: string,
) {
  let existingSha: string | undefined;

  try {
    const existing = await githubApiRequest<GithubContent>(
      token,
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    );
    existingSha = existing.sha;
  } catch {
    existingSha = undefined;
  }

  await githubApiRequest(token, `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: asBase64(content),
      sha: existingSha,
    }),
  });
}

export async function POST(request: Request) {
  const token = await getGithubTokenFromCookies();

  if (!token) {
    return NextResponse.json({ error: "Not authenticated with GitHub." }, { status: 401 });
  }

  const payload = (await request.json()) as PushPayload;

  if (!payload.repo || !payload.code) {
    return NextResponse.json(
      { error: "Repository and generated code are required to push." },
      { status: 400 },
    );
  }

  try {
    const user = await githubApiRequest<GithubUser>(token, "/user");
    const owner = payload.owner ?? user.login;
    const projectName = payload.projectName ?? payload.repo;

    const readme = `# ${projectName}\n\nBuilt with Velosite and pushed automatically from the app.\n\n## Files\n\n- \`index.html\`: Generated website output\n`;

    await upsertFile(token, owner, payload.repo, "README.md", "docs: add README", readme);
    await upsertFile(token, owner, payload.repo, "index.html", "feat: add generated site", payload.code);

    return NextResponse.json({ ok: true, repoUrl: `https://github.com/${owner}/${payload.repo}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to push files to GitHub." },
      { status: 500 },
    );
  }
}
