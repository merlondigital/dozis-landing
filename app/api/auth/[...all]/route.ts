import { createAuth } from "@/src/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Create auth per-request to access Cloudflare env bindings
async function handleAuthRequest(request: Request) {
  const { env } = getCloudflareContext();
  const auth = createAuth(env);
  return auth.handler(request);
}

export const { GET, POST } = toNextJsHandler(handleAuthRequest);
