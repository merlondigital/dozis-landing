import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth-utils";
import { getEventById } from "@/src/lib/events/actions";
import { getEventGuests, getEventStats } from "@/src/lib/checkin/queries";
import { ScannerView } from "./scanner-view";

interface ScanPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanPage({ params }: ScanPageProps) {
  await requireAdmin();
  const { id } = await params;

  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  const [guests, stats] = await Promise.all([
    getEventGuests(id),
    getEventStats(id),
  ]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Link
        href={`/app/admin/events`}
        className="text-sm text-muted-foreground hover:text-white transition-colors"
      >
        &larr; Vissza az eseményekhez
      </Link>

      <ScannerView
        eventId={id}
        eventName={event.name}
        guests={guests}
        initialCheckedIn={stats?.checkedIn ?? 0}
        totalRegistered={stats?.totalRegistered ?? 0}
      />
    </div>
  );
}
