import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { Calendar, MapPin, ArrowRight, QrCode } from "lucide-react";
import { requireProfile } from "@/src/lib/auth-utils";
import { getUpcomingEvents, getUserRegistration } from "@/src/lib/events/actions";
import { GenreBadge, parseGenreTags } from "@/components/events/genre-badge";

export default async function DashboardPage() {
  const result = await requireProfile();
  if (!result) redirect("/app/login");
  if (result.needsProfile) redirect("/app/register");

  const { session } = result;
  const user = session.user as { firstName?: string; name: string; id: string };

  const upcoming = await getUpcomingEvents();
  const nextEvent = upcoming[0] ?? null;

  // Check if user is registered for the next event
  let isRegistered = false;
  if (nextEvent) {
    const reg = await getUserRegistration(nextEvent.id, user.id);
    isRegistered = reg !== null && reg.status === "registered";
  }

  const nextEventGenres = nextEvent
    ? parseGenreTags(nextEvent.genreTags)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-3xl text-white tracking-wide">
          Szia, {user.firstName || user.name}!
        </h2>
        <p className="text-zinc-400 mt-2">
          Udvozlunk a DOZIS. alkalmazasban.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next event card */}
        {nextEvent ? (
          <Link
            href={`/app/events/${nextEvent.id}`}
            className="bg-dozis-navy rounded-xl p-6 border border-zinc-800 hover:border-zinc-600 transition-colors block"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-xl text-dozis-amber">
                Kovetkezo esemeny
              </h3>
              {isRegistered && (
                <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                  <QrCode className="size-3.5" />
                  Regisztralt
                </span>
              )}
            </div>

            <p className="text-white font-heading text-lg">
              {nextEvent.name}
            </p>

            <div className="mt-2 flex items-center gap-2 text-zinc-400 text-sm">
              <Calendar className="size-4 shrink-0" />
              <span>
                {format(nextEvent.date, "MMMM d., EEEE, HH:mm", { locale: hu })}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-zinc-400 text-sm">
              <MapPin className="size-4 shrink-0" />
              <span>{nextEvent.venue}</span>
            </div>

            {nextEventGenres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {nextEventGenres.map((g) => (
                  <GenreBadge key={g} genre={g} />
                ))}
              </div>
            )}
          </Link>
        ) : (
          <div className="bg-dozis-navy rounded-xl p-6 border border-zinc-800">
            <h3 className="font-heading text-xl text-dozis-amber mb-2">
              Esemenyek
            </h3>
            <p className="text-zinc-400 text-sm">
              Jelenleg nincs kozelgo esemeny.
            </p>
          </div>
        )}

        {/* Loyalty program placeholder */}
        <div className="bg-dozis-navy rounded-xl p-6 border border-zinc-800">
          <h3 className="font-heading text-xl text-dozis-amber mb-2">
            Husegprogram
          </h3>
          <p className="text-zinc-400 text-sm">Hamarosan...</p>
        </div>
      </div>

      {/* Link to all events */}
      <Link
        href="/app/events"
        className="inline-flex items-center gap-2 text-dozis-amber hover:text-dozis-amber-light transition-colors text-sm font-medium"
      >
        Osszes esemeny
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
