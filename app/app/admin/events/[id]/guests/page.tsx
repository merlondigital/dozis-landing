export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth-utils";
import { getEventById } from "@/src/lib/events/actions";
import { getEventGuests, getEventStats } from "@/src/lib/checkin/queries";
import { GuestList } from "@/components/admin/guest-list";

interface GuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const session = await requireAdmin();
  if (!session) redirect("/app/login");

  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const [guests, stats] = await Promise.all([
    getEventGuests(id),
    getEventStats(id),
  ]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Link
        href="/app/admin/events"
        className="text-sm text-muted-foreground hover:text-white transition-colors"
      >
        &larr; Vissza az eseményekhez
      </Link>

      <div>
        <h2 className="font-heading text-2xl text-white tracking-wide">
          {event.name}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Vendéglista</p>
      </div>

      <GuestList
        guests={guests}
        stats={stats ?? { totalRegistered: 0, checkedIn: 0, noShows: 0, checkInRate: 0 }}
        eventId={id}
      />
    </div>
  );
}
