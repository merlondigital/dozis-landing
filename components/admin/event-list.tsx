"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { ScanLine, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/src/lib/events/actions";

// Genre badge color mapping (shared with event-form)
const GENRE_COLORS: Record<string, string> = {
  "UK Garage": "bg-amber-500/20 text-amber-400",
  "Club Trance": "bg-blue-500/20 text-blue-400",
  "Tech House": "bg-purple-500/20 text-purple-400",
  "Deep House": "bg-cyan-500/20 text-cyan-400",
  "Afro House": "bg-green-500/20 text-green-400",
  "Bouncy": "bg-pink-500/20 text-pink-400",
};

export interface EventData {
  id: string;
  name: string;
  date: Date;
  venue: string;
  description: string | null;
  genreTags: string | null;
  imageUrl: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EventListProps {
  events: EventData[];
  counts?: Record<string, { registered: number; checkedIn: number }>;
}

export function EventList({ events: initialEvents, counts = {} }: EventListProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(eventId: string, eventName: string) {
    const confirmed = window.confirm(
      `Biztosan törlöd ezt az eseményt: "${eventName}"? A regisztrációk is törlődnek.`
    );
    if (!confirmed) return;

    setDeletingId(eventId);

    // Optimistic update: remove from list immediately
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    startTransition(async () => {
      try {
        const result = await deleteEvent(eventId);

        if ("error" in result) {
          // Revert optimistic update on error
          setEvents(initialEvents);
          alert(result.error);
        }

        router.refresh();
      } catch {
        setEvents(initialEvents);
        alert("Hiba történt a törlés során.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Még nincs esemény. Hozz létre az elsőt!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const genres = event.genreTags
          ? event.genreTags.split(",").map((g) => g.trim())
          : [];
        const isPast = event.date < new Date();
        const eventCounts = counts[event.id];

        return (
          <div
            key={event.id}
            className={`rounded-lg border border-zinc-800 bg-dozis-navy p-4 transition-colors hover:border-zinc-700 ${
              isPast ? "opacity-60" : ""
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-body font-semibold text-white truncate">
                    {event.name}
                  </h3>
                  {isPast && (
                    <span className="text-xs text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5">
                      MÚLT
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {format(event.date, "yyyy. MMMM d., HH:mm", { locale: hu })}
                  {" — "}
                  {event.venue}
                </p>

                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {genres.map((genre) => (
                      <span
                        key={genre}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          GENRE_COLORS[genre] ?? "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Registration/check-in counts */}
                {eventCounts && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {eventCounts.registered} regisztrált, {eventCounts.checkedIn} becsekkolva
                  </p>
                )}
              </div>

              {/* Quick links + actions */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <Link href={`/app/admin/events/${event.id}/scan`}>
                  <Button variant="outline" size="sm" className="gap-1.5 w-full">
                    <ScanLine className="size-3.5" />
                    Szkenner
                  </Button>
                </Link>
                <Link href={`/app/admin/events/${event.id}/guests`}>
                  <Button variant="outline" size="sm" className="gap-1.5 w-full">
                    <Users className="size-3.5" />
                    Vendégek
                  </Button>
                </Link>
                <Link href={`/app/admin/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1.5 w-full">
                    <Pencil className="size-3.5" />
                    Szerkesztés
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5 w-full"
                  onClick={() => handleDelete(event.id, event.name)}
                  disabled={isPending && deletingId === event.id}
                >
                  <Trash2 className="size-3.5" />
                  {isPending && deletingId === event.id
                    ? "Törlés..."
                    : "Törlés"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
