import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/src/db";
import { registration, event, user } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/src/lib/auth-utils";
import { generateWalletPass } from "@/src/lib/wallet/generate-pass";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  const { registrationId } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { env } = getCloudflareContext();

  // Check if Apple Wallet certs are configured
  if (
    !env.APPLE_PASS_SIGNERKEY ||
    !env.APPLE_PASS_SIGNERCERT ||
    !env.APPLE_PASS_WWDR ||
    !env.APPLE_PASS_TYPE_ID ||
    !env.APPLE_TEAM_ID
  ) {
    return NextResponse.json(
      { error: "Apple Wallet nincs konfigurálva" },
      { status: 503 },
    );
  }

  const db = getDb(env.DB);

  // Fetch registration with event and user data
  const [reg] = await db
    .select({
      id: registration.id,
      qrToken: registration.qrToken,
      status: registration.status,
      isFree: registration.isFree,
      userId: registration.userId,
      eventId: registration.eventId,
      eventName: event.name,
      eventDate: event.date,
      eventVenue: event.venue,
      userName: user.name,
      userFirstName: user.firstName,
      userLastName: user.lastName,
    })
    .from(registration)
    .innerJoin(event, eq(registration.eventId, event.id))
    .innerJoin(user, eq(registration.userId, user.id))
    .where(
      and(
        eq(registration.id, registrationId),
        eq(registration.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!reg || reg.status !== "registered") {
    return NextResponse.json(
      { error: "Regisztráció nem található" },
      { status: 404 },
    );
  }

  const displayName =
    reg.userLastName && reg.userFirstName
      ? `${reg.userLastName} ${reg.userFirstName}`
      : reg.userName;

  try {
    const passBuffer = await generateWalletPass(
      {
        registrationId: reg.id,
        qrToken: reg.qrToken,
        eventName: reg.eventName,
        eventDate: reg.eventDate,
        eventVenue: reg.eventVenue,
        userName: displayName,
        isFree: reg.isFree,
      },
      {
        APPLE_PASS_SIGNERKEY: env.APPLE_PASS_SIGNERKEY,
        APPLE_PASS_SIGNERCERT: env.APPLE_PASS_SIGNERCERT,
        APPLE_PASS_WWDR: env.APPLE_PASS_WWDR,
        APPLE_PASS_TYPE_ID: env.APPLE_PASS_TYPE_ID,
        APPLE_TEAM_ID: env.APPLE_TEAM_ID,
      },
    );

    return new NextResponse(new Uint8Array(passBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="dozis-kupon-${reg.eventId}.pkpass"`,
      },
    });
  } catch (error) {
    console.error("Wallet pass generation failed:", error);
    return NextResponse.json(
      { error: "Nem sikerült a pass generálása" },
      { status: 500 },
    );
  }
}
