"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createAuth } from "@/src/lib/auth";
import { getDb } from "@/src/db";
import { user } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { headers, cookies } from "next/headers";

interface ProfileData {
  lastName: string;
  firstName: string;
  birthYear: number;
  address: string;
}

export async function updateProfile(data: ProfileData) {
  // Validate on server side
  if (!data.lastName?.trim() || !data.firstName?.trim() || !data.address?.trim()) {
    return { error: "Minden mező kitöltése kötelező." };
  }
  if (!data.birthYear || data.birthYear < 1940 || data.birthYear > 2010) {
    return { error: "A születési év 1940 és 2010 között legyen." };
  }

  const { env } = getCloudflareContext();
  const auth = createAuth(env);

  // Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Nincs bejelentkezve." };
  }

  try {
    // Update profile fields via Drizzle directly
    // This allows setting profileCompleted which has input: false in better-auth config
    const db = getDb(env.DB);
    await db
      .update(user)
      .set({
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        lastName: data.lastName.trim(),
        firstName: data.firstName.trim(),
        birthYear: data.birthYear,
        address: data.address.trim(),
        profileCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    // Clear better-auth cookie cache so the next getSession() reads fresh DB data
    // Cookie name varies: "better-auth.session_data" (HTTP) or "__Secure-better-auth.session_data" (HTTPS)
    const cookieStore = await cookies();
    for (const cookie of cookieStore.getAll()) {
      if (cookie.name.includes("session_data")) {
        cookieStore.delete(cookie.name);
      }
    }

    return { success: true };
  } catch {
    return { error: "Hiba történt a mentés során." };
  }
}
