import { cookies } from "next/headers";

const TOKEN_COOKIE_KEY = "github_access_token";

export async function getGithubTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_KEY)?.value ?? null;
}

export async function githubApiRequest<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `GitHub API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export { TOKEN_COOKIE_KEY };
