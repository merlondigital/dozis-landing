"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/src/db";
import { event, registration, user } from "@/src/db/schema";
import { eq, and, gt, lte, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession, requireAdmin } from "@/src/lib/auth-utils";
import {
  createEventSchema,
  updateEventSchema,
  type CreateEventInput,
  type UpdateEventInput,
} from "./validation";
import { generateQrToken } from "./qr";

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

export async function createEvent(input: CreateEventInput) {
  const session = await requireAdmin();
  if (!session) return { error: "Nincs jogosultsagod." };

  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ervenytelen adatok." };
  }

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  try {
    const [created] = await db
      .insert(event)
      .values({
        name: parsed.data.name,
        date: parsed.data.date,
        venue: parsed.data.venue,
        description: parsed.data.description ?? null,
        genreTags: parsed.data.genreTags.join(","),
        imageUrl: parsed.data.imageUrl || null,
        createdBy: session.user.id,
      })
      .returning({ id: event.id });

    revalidatePath("/app/events");
    revalidatePath("/app/admin/events");

    return { success: true, eventId: created.id };
  } catch {
    return { error: "Hiba tortent az esemeny letrehozasakor." };
  }
}

export async function updateEvent(input: UpdateEventInput) {
  const session = await requireAdmin();
  if (!session) return { error: "Nincs jogosultsagod." };

  const parsed = updateEventSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ervenytelen adatok." };
  }

  const { id, ...fields } = parsed.data;
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  try {
    // Build update set dynamically from provided fields
    const updateSet: Record<string, unknown> = { updatedAt: new Date() };
    if (fields.name !== undefined) updateSet.name = fields.name;
    if (fields.date !== undefined) updateSet.date = fields.date;
    if (fields.venue !== undefined) updateSet.venue = fields.venue;
    if (fields.description !== undefined)
      updateSet.description = fields.description ?? null;
    if (fields.genreTags !== undefined)
      updateSet.genreTags = fields.genreTags.join(",");
    if (fields.imageUrl !== undefined)
      updateSet.imageUrl = fields.imageUrl || null;

    await db.update(event).set(updateSet).where(eq(event.id, id));

    revalidatePath("/app/events");
    revalidatePath("/app/admin/events");

    return { success: true };
  } catch {
    return { error: "Hiba tortent az esemeny frissitesekor." };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await requireAdmin();
  if (!session) return { error: "Nincs jogosultsagod." };

  if (!eventId) return { error: "Ervenytelen esemeny azonosito." };

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  try {
    // Registrations cascade-delete per D-24
    await db.delete(event).where(eq(event.id, eventId));

    revalidatePath("/app/events");
    revalidatePath("/app/admin/events");

    return { success: true };
  } catch {
    return { error: "Hiba tortent az esemeny torlesekor." };
  }
}

// ---------------------------------------------------------------------------
// User mutations
// ---------------------------------------------------------------------------

export async function registerForEvent(eventId: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Jelentkezz be elobb." };

  if (!eventId) return { error: "Ervenytelen esemeny azonosito." };

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  try {
    // Verify event exists and is in the future
    const [targetEvent] = await db
      .select()
      .from(event)
      .where(eq(event.id, eventId))
      .limit(1);

    if (!targetEvent) return { error: "Az esemeny nem talalhato." };
    if (targetEvent.date <= new Date())
      return { error: "Erre az esemenyre mar nem lehet regisztralni." };

    // Check loyalty status: if attendanceCount >= 4, this registration is free (per D-20)
    const [userData] = await db
      .select({ attendanceCount: user.attendanceCount })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    const isFree = (userData?.attendanceCount ?? 0) >= 4;

    // Generate QR token
    const registrationId = crypto.randomUUID();
    const qrToken = await generateQrToken(
      registrationId,
      eventId,
      session.user.id,
      env.BETTER_AUTH_SECRET
    );

    // Insert registration (isFree auto-set based on loyalty counter)
    await db.insert(registration).values({
      id: registrationId,
      eventId,
      userId: session.user.id,
      qrToken,
      status: "registered",
      isFree,
    });

    revalidatePath("/app/events");
    revalidatePath("/app/admin/events");

    return { success: true, registrationId, qrToken };
  } catch (err: unknown) {
    // Handle UNIQUE constraint violation (duplicate registration) per REGN-04
    const message =
      err instanceof Error ? err.message : String(err);
    if (message.includes("UNIQUE constraint failed")) {
      return { error: "Mar regisztraltal erre az esemenyre." };
    }
    return { error: "Hiba tortent a regisztracio soran." };
  }
}

export async function cancelRegistration(registrationId: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Jelentkezz be elobb." };

  if (!registrationId) return { error: "Ervenytelen regisztracio azonosito." };

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  try {
    // Verify registration belongs to user
    const [reg] = await db
      .select()
      .from(registration)
      .where(eq(registration.id, registrationId))
      .limit(1);

    if (!reg) return { error: "A regisztracio nem talalhato." };
    if (reg.userId !== session.user.id)
      return { error: "Nincs jogosultsagod." };

    // Verify event is in the future
    const [targetEvent] = await db
      .select()
      .from(event)
      .where(eq(event.id, reg.eventId))
      .limit(1);

    if (!targetEvent || targetEvent.date <= new Date())
      return { error: "Mult esemenyre nem lehet lemondani." };

    // Delete registration per D-20
    await db
      .delete(registration)
      .where(eq(registration.id, registrationId));

    revalidatePath("/app/events");
    revalidatePath("/app/admin/events");

    return { success: true };
  } catch {
    return { error: "Hiba tortent a lemondas soran." };
  }
}

// ---------------------------------------------------------------------------
// Query helpers (also server-callable since file has "use server")
// ---------------------------------------------------------------------------

export async function getUpcomingEvents() {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  return db
    .select()
    .from(event)
    .where(gt(event.date, new Date()))
    .orderBy(asc(event.date));
}

export async function getAllEvents() {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  return db.select().from(event).orderBy(desc(event.date));
}

export async function getPastEvents() {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  return db
    .select()
    .from(event)
    .where(lte(event.date, new Date()))
    .orderBy(desc(event.date));
}

export async function getEventById(id: string) {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [result] = await db
    .select()
    .from(event)
    .where(eq(event.id, id))
    .limit(1);

  return result ?? null;
}

export async function getUserRegistration(eventId: string, userId: string) {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [result] = await db
    .select()
    .from(registration)
    .where(
      and(
        eq(registration.eventId, eventId),
        eq(registration.userId, userId)
      )
    )
    .limit(1);

  return result ?? null;
}
