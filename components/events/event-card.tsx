import Link from "next/link";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { MapPin, Calendar } from "lucide-react";
import { GenreBadge, parseGenreTags } from "./genre-badge";

export interface EventData {
  id: string;
  name: string;
  date: Date;
  venue: string;
  genreTags: string | null;
  imageUrl: string | null;
  description: string | null;
}

export function EventCard({ event }: { event: EventData }) {
  const genres = parseGenreTags(event.genreTags);

  return (
    <Link
      href={`/app/events/${event.id}`}
      className="block bg-dozis-navy rounded-xl border border-zinc-800 p-6 hover:border-zinc-600 transition-colors"
    >
      <h3 className="font-heading text-xl text-white tracking-wide">
        {event.name}
      </h3>

      <div className="mt-3 flex items-center gap-2 text-zinc-400 text-sm">
        <Calendar className="size-4 shrink-0" />
        <span>
          {format(event.date, "yyyy. MMMM d., EEEE, HH:mm", { locale: hu })}
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2 text-zinc-400 text-sm">
        <MapPin className="size-4 shrink-0" />
        <span>{event.venue}</span>
      </div>

      {genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {genres.map((g) => (
            <GenreBadge key={g} genre={g} />
          ))}
        </div>
      )}
    </Link>
  );
}
