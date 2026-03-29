import { createAuth } from "@/src/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

async function handleAuth(request: NextRequest) {
  const { env } = getCloudflareContext();
  const auth = createAuth(env);

  const response = await auth.handler(request);

  // Log non-2xx responses for debugging
  if (!response.ok) {
    const cloned = response.clone();
    try {
      const body = await cloned.text();
      console.error(`[auth] ${request.method} ${request.nextUrl.pathname} → ${response.status}:`, body);
    } catch {
      // ignore
    }
  }

  return response;
}

export async function GET(request: NextRequest) {
  return handleAuth(request);
}

export async function POST(request: NextRequest) {
  return handleAuth(request);
}
