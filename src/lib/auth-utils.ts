import { createAuth } from "./auth";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Get the current session on the server side.
 * Use in Server Components and Server Actions.
 */
export async function getSession() {
  const { env } = getCloudflareContext();
  const auth = createAuth(env);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Check if the current user is an admin.
 * Returns the session if admin, null otherwise.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return null;
  }
  return session;
}

/**
 * Check if the current user has completed their profile.
 */
export async function requireProfile() {
  const session = await getSession();
  if (!session?.user) return null;
  const user = session.user as Record<string, unknown>;
  if (!user.profileCompleted) return { needsProfile: true, session };
  return { needsProfile: false, session };
}

/**
 * Mask email for display: m***n@gmail.com
 * Per D-15: Email partially masked on OTP step.
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}
