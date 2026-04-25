import { NextResponse } from "next/server";
import { TOKEN_COOKIE_KEY } from "@/lib/github";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: TOKEN_COOKIE_KEY,
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
