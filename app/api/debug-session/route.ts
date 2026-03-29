import { getSession } from "@/src/lib/auth-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user ? {
        id: (session.user as Record<string, unknown>).id,
        email: (session.user as Record<string, unknown>).email,
        role: (session.user as Record<string, unknown>).role,
        profileCompleted: (session.user as Record<string, unknown>).profileCompleted,
        name: (session.user as Record<string, unknown>).name,
      } : null,
    });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
