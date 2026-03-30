"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/src/db";
import { registration, user } from "@/src/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth-utils";
import { verifyQrToken } from "@/src/lib/events/qr";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CheckInResult =
  | { success: true; type: "success"; guestName: string; isFree: boolean; newAttendanceCount: number }
  | { error: string; type: "invalid" | "wrong_event" | "not_found" | "duplicate" | "cancelled" | "unauthorized"; guestName?: string };

// ---------------------------------------------------------------------------
// Shared check-in logic (used by both QR and manual flows)
// ---------------------------------------------------------------------------

async function performCheckIn(
  registrationId: string,
  eventId: string,
  adminId: string
): Promise<CheckInResult> {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  // Look up registration
  const [reg] = await db
    .select()
    .from(registration)
    .where(eq(registration.id, registrationId))
    .limit(1);

  if (!reg) {
    return { error: "Nincs regisztráció.", type: "not_found" };
  }

  // Verify it belongs to the given event
  if (reg.eventId !== eventId) {
    return { error: "Ez a QR kód másik eseményhez tartozik.", type: "wrong_event" };
  }

  // Reject duplicate check-in (per D-14)
  if (reg.checkedInAt !== null) {
    // Look up guest name for feedback
    const [guest] = await db
      .select({ firstName: user.firstName, lastName: user.lastName, name: user.name })
      .from(user)
      .where(eq(user.id, reg.userId))
      .limit(1);
    const guestName = guest
      ? [guest.firstName, guest.lastName].filter(Boolean).join(" ") || guest.name
      : "Ismeretlen";
    return { error: "Már becsekkolva.", type: "duplicate", guestName };
  }

  // Reject cancelled registrations
  if (reg.status === "cancelled") {
    return { error: "A regisztráció törölve lett.", type: "cancelled" };
  }

  // --- Perform check-in + loyalty update (atomic where possible) ---

  // 1. Update registration: set checkedInAt and checkedInBy
  await db
    .update(registration)
    .set({ checkedInAt: new Date(), checkedInBy: adminId })
    .where(and(eq(registration.id, registrationId), sql`${registration.checkedInAt} IS NULL`));

  // 2. Look up user for name display
  const [userData] = await db
    .select({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      attendanceCount: user.attendanceCount,
    })
    .from(user)
    .where(eq(user.id, reg.userId))
    .limit(1);

  if (!userData) {
    return { error: "Nincs regisztráció.", type: "not_found" };
  }

  // 3. Loyalty logic — atomic increment/reset (per D-19, D-21)
  let newAttendanceCount: number;
  if (reg.isFree) {
    // Free 5th event → reset counter to 0 (per D-21)
    newAttendanceCount = 0;
    await db.update(user).set({ attendanceCount: 0 }).where(eq(user.id, userData.id));
  } else {
    // Atomic increment to avoid TOCTOU race (per D-19)
    await db
      .update(user)
      .set({ attendanceCount: sql`${user.attendanceCount} + 1` })
      .where(eq(user.id, userData.id));
    newAttendanceCount = userData.attendanceCount + 1;
  }

  const guestName = [userData.firstName, userData.lastName].filter(Boolean).join(" ") || userData.name;

  // Revalidate admin pages
  revalidatePath(`/app/admin/events/${eventId}/guests`);
  revalidatePath(`/app/admin/events/${eventId}/scan`);
  revalidatePath(`/app/admin/events/${eventId}`);

  return {
    success: true,
    type: "success",
    guestName,
    isFree: reg.isFree,
    newAttendanceCount,
  };
}

// ---------------------------------------------------------------------------
// QR token check-in (main flow, per D-13)
// ---------------------------------------------------------------------------

export async function checkInByToken(
  token: string,
  eventId: string
): Promise<CheckInResult> {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Nincs jogosultságod.", type: "unauthorized" };
  }

  const { env } = getCloudflareContext();

  // Verify HMAC token
  const result = await verifyQrToken(token, env.BETTER_AUTH_SECRET);
  if (!result.valid || !result.registrationId || !result.eventId || !result.userId) {
    return { error: "Érvénytelen QR kód.", type: "invalid" };
  }

  // Verify token belongs to this event
  if (result.eventId !== eventId) {
    return { error: "Ez a QR kód másik eseményhez tartozik.", type: "wrong_event" };
  }

  return performCheckIn(result.registrationId, eventId, session.user.id);
}

// ---------------------------------------------------------------------------
// Manual check-in by registration ID (fallback, per D-27)
// ---------------------------------------------------------------------------

export async function manualCheckInByRegistrationId(
  registrationId: string,
  eventId: string
): Promise<CheckInResult> {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Nincs jogosultságod.", type: "unauthorized" };
  }

  if (!registrationId || !eventId) {
    return { error: "Érvénytelen azonosító.", type: "invalid" };
  }

  return performCheckIn(registrationId, eventId, session.user.id);
}
