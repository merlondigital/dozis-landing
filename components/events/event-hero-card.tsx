import Link from "next/link";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { GenreBadge, parseGenreTags } from "./genre-badge";
import type { EventData } from "./event-card";

export function EventHeroCard({ event }: { event: EventData }) {
  const genres = parseGenreTags(event.genreTags);

  return (
    <div className="relative bg-dozis-navy rounded-xl border border-dozis-amber/30 p-8 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-dozis-amber/5 to-transparent pointer-events-none" />

      <div className="relative">
        <p className="text-dozis-amber text-sm font-medium uppercase tracking-wider mb-2">
          Kovetkezo esemeny
        </p>

        <h2 className="font-heading text-3xl text-white tracking-wide">
          {event.name}
        </h2>

        <div className="mt-4 flex items-center gap-2 text-dozis-amber text-base">
          <Calendar className="size-5 shrink-0" />
          <span>
            {format(event.date, "yyyy. MMMM d., EEEE, HH:mm", { locale: hu })}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-zinc-300 text-base">
          <MapPin className="size-5 shrink-0" />
          <span>{event.venue}</span>
        </div>

        {genres.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.map((g) => (
              <GenreBadge key={g} genre={g} />
            ))}
          </div>
        )}

        <Link
          href={`/app/events/${event.id}`}
          className="mt-6 inline-flex items-center justify-center gap-2 min-h-[44px] bg-dozis-amber text-black font-medium px-6 py-2.5 rounded-lg hover:bg-dozis-amber-light transition-colors"
        >
          Reszletek
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
