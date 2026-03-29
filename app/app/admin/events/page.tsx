import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/admin/event-list";
import { getAllEvents } from "@/src/lib/events/actions";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

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

      <EventList events={events} />
    </div>
  );
}
