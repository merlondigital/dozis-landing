import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/admin/event-list";
import { getAllEvents } from "@/src/lib/events/actions";
import { getEventRegistrationCounts } from "@/src/lib/checkin/queries";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  // Fetch registration/check-in counts for all events
  const eventIds = events.map((e) => e.id);
  const countsMap = await getEventRegistrationCounts(eventIds);

  // Serialize Map to plain object for client component boundary
  const counts: Record<string, { registered: number; checkedIn: number }> = {};
  for (const [id, data] of countsMap) {
    counts[id] = data;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-3xl text-white tracking-wide">
          Esemenyek
        </h2>
        <Link href="/app/admin/events/new">
          <Button>Uj esemeny</Button>
        </Link>
      </div>

      <EventList events={events} counts={counts} />
    </div>
  );
}
