"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/src/db";
import { registration, user, event } from "@/src/db/schema";
import { eq, and, sql, inArray, isNotNull, lte } from "drizzle-orm";
import { requireAdmin, getSession } from "@/src/lib/auth-utils";

// ---------------------------------------------------------------------------
// Guest list for an event (per D-24, D-25)
// ---------------------------------------------------------------------------

export async function getEventGuests(eventId: string) {
  const session = await requireAdmin();
  if (!session) return [];

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const rows = await db
    .select({
      registrationId: registration.id,
      userId: registration.userId,
      name: user.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: registration.status,
      isFree: registration.isFree,
      registeredAt: registration.createdAt,
      checkedInAt: registration.checkedInAt,
    })
    .from(registration)
    .innerJoin(user, eq(registration.userId, user.id))
    .where(eq(registration.eventId, eventId))
    .orderBy(registration.createdAt);

  return rows;
}

// ---------------------------------------------------------------------------
// Event stats / analytics (per D-28, ADMN-03)
// ---------------------------------------------------------------------------

export async function getEventStats(eventId: string) {
  const session = await requireAdmin();
  if (!session) return null;

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  // Get event date to determine if it's past
  const [eventRow] = await db
    .select({ date: event.date })
    .from(event)
    .where(eq(event.id, eventId))
    .limit(1);

  const isPast = eventRow ? eventRow.date <= new Date() : false;

  const rows = await db
    .select({
      status: registration.status,
      checkedInAt: registration.checkedInAt,
    })
    .from(registration)
    .where(eq(registration.eventId, eventId));

  const totalRegistered = rows.filter((r) => r.status === "registered").length;
  const checkedIn = rows.filter((r) => r.checkedInAt !== null).length;
  // No-shows: registered, not checked in, and event is in the past
  const noShows = isPast
    ? rows.filter((r) => r.status === "registered" && r.checkedInAt === null).length
    : 0;
  const checkInRate = totalRegistered > 0 ? Math.round((checkedIn / totalRegistered) * 100) : 0;

  return { totalRegistered, checkedIn, noShows, checkInRate };
}

// ---------------------------------------------------------------------------
// User loyalty info (per LOYL-01)
// ---------------------------------------------------------------------------

export async function getUserLoyalty(userId: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [userData] = await db
    .select({ attendanceCount: user.attendanceCount })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userData) return null;

  // attendanceCount is always 0-4 (resets after free event per D-21)
  // nextIsFree when count reaches 4 (per D-20)
  const attendanceCount = userData.attendanceCount;
  const nextIsFree = attendanceCount >= 4;

  return {
    attendanceCount,
    progress: attendanceCount, // 0-4 range directly
    nextIsFree,
  };
}

// ---------------------------------------------------------------------------
// Bulk registration counts for admin event list (per D-29)
// ---------------------------------------------------------------------------

export async function getEventRegistrationCounts(eventIds: string[]) {
  if (eventIds.length === 0) return new Map<string, { registered: number; checkedIn: number }>();

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const rows = await db
    .select({
      eventId: registration.eventId,
      registered: sql<number>`count(*)`.as("registered"),
      checkedIn: sql<number>`count(${registration.checkedInAt})`.as("checked_in"),
    })
    .from(registration)
    .where(
      and(
        inArray(registration.eventId, eventIds),
        eq(registration.status, sql`'registered'`)
      )
    )
    .groupBy(registration.eventId);

  const result = new Map<string, { registered: number; checkedIn: number }>();
  for (const row of rows) {
    result.set(row.eventId, { registered: row.registered, checkedIn: row.checkedIn });
  }
  return result;
}
