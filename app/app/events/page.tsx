import { getUpcomingEvents, getPastEvents } from "@/src/lib/events/actions";
import { EventCard } from "@/components/events/event-card";
import { EventHeroCard } from "@/components/events/event-hero-card";
import type { EventData } from "@/components/events/event-card";

function toEventData(row: {
  id: string;
  name: string;
  date: Date;
  venue: string;
  genreTags: string | null;
  imageUrl: string | null;
  description: string | null;
}): EventData {
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    venue: row.venue,
    genreTags: row.genreTags,
    imageUrl: row.imageUrl,
    description: row.description,
  };
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const heroEvent = upcoming[0] ? toEventData(upcoming[0]) : null;
  const restEvents = upcoming.slice(1).map(toEventData);
  const pastEvents = past.map(toEventData);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl text-white tracking-wide">
        Esemenyek
      </h1>

      {/* Upcoming events */}
      {heroEvent ? (
        <>
          <EventHeroCard event={heroEvent} />

          {restEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-dozis-navy rounded-xl border border-zinc-800 p-12 text-center">
          <p className="text-zinc-400 text-lg">
            Jelenleg nincs kozelgo esemeny
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            Nezz vissza kesobb az uj esemenyekert!
          </p>
        </div>
      )}

      {/* Past events */}
      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-zinc-500 text-sm uppercase tracking-wider">
              Korabbi esemenyek
            </span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {pastEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
