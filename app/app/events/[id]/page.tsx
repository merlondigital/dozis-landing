export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { getEventById, getUserRegistration } from "@/src/lib/events/actions";
import { getSession } from "@/src/lib/auth-utils";
import { GenreBadge, parseGenreTags } from "@/components/events/genre-badge";
import { EventDetailActions } from "@/components/events/event-detail-actions";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [eventData, session] = await Promise.all([
    getEventById(id),
    getSession(),
  ]);

  if (!eventData) notFound();
  if (!session?.user) redirect("/app/login");

  const reg = await getUserRegistration(id, session.user.id);
  const genres = parseGenreTags(eventData.genreTags);
  const isPast = eventData.date <= new Date();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/app/events"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="size-4" />
        Vissza
      </Link>

      {/* Event image */}
      {eventData.imageUrl && (
        <div className="rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={eventData.imageUrl}
            alt={eventData.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Event info */}
      <div>
        <h1 className="font-heading text-3xl text-white tracking-wide">
          {eventData.name}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-dozis-amber">
          <Calendar className="size-5 shrink-0" />
          <span className="text-base">
            {format(eventData.date, "yyyy. MMMM d., EEEE, HH:mm", { locale: hu })}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-zinc-300">
          <MapPin className="size-5 shrink-0" />
          <span className="text-base">{eventData.venue}</span>
        </div>

        {genres.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.map((g) => (
              <GenreBadge key={g} genre={g} />
            ))}
          </div>
        )}

        {eventData.description && (
          <p className="mt-6 text-zinc-400 whitespace-pre-wrap leading-relaxed">
            {eventData.description}
          </p>
        )}
      </div>

      {/* Registration section */}
      <div className="border-t border-zinc-800 pt-6">
        {isPast ? (
          <p className="text-zinc-500 text-center">
            Ez az esemeny mar lezarult.
          </p>
        ) : (
          <EventDetailActions
            eventId={id}
            eventName={eventData.name}
            eventDate={eventData.date}
            registration={
              reg && reg.status === "registered"
                ? { id: reg.id, qrToken: reg.qrToken }
                : null
            }
          />
        )}
      </div>
    </div>
  );
}
