"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import {
  Users,
  CheckCircle,
  XCircle,
  Percent,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { manualCheckInByRegistrationId } from "@/src/lib/checkin/actions";

// ---------------------------------------------------------------------------
// Types (matching query return shapes)
// ---------------------------------------------------------------------------

interface GuestRow {
  registrationId: string;
  userId: string;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  isFree: boolean;
  registeredAt: Date;
  checkedInAt: Date | null;
}

interface EventStats {
  totalRegistered: number;
  checkedIn: number;
  noShows: number;
  checkInRate: number;
}

interface GuestListProps {
  guests: GuestRow[];
  stats: EventStats;
  eventId: string;
}

// ---------------------------------------------------------------------------
// Stat card helper
// ---------------------------------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  iconColor: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className={`size-5 ${iconColor} shrink-0`} />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-heading text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Guest display name
// ---------------------------------------------------------------------------

function guestDisplayName(g: GuestRow): string {
  const full = [g.firstName, g.lastName].filter(Boolean).join(" ");
  return full || g.name;
}

// ---------------------------------------------------------------------------
// GuestList component
// ---------------------------------------------------------------------------

export function GuestList({ guests: initialGuests, stats, eventId }: GuestListProps) {
  const router = useRouter();
  const [guests, setGuests] = useState(initialGuests);
  const [search, setSearch] = useState("");
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = guests.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      guestDisplayName(g).toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q)
    );
  });

  function handleCheckIn(registrationId: string) {
    setCheckingInId(registrationId);

    startTransition(async () => {
      try {
        const result = await manualCheckInByRegistrationId(registrationId, eventId);

        if ("success" in result && result.success) {
          // Optimistic update: mark guest as checked in
          setGuests((prev) =>
            prev.map((g) =>
              g.registrationId === registrationId
                ? { ...g, checkedInAt: new Date() }
                : g
            )
          );
          router.refresh();
        } else if ("error" in result) {
          alert(result.error);
        }
      } catch {
        alert("Hiba tortent a becsekkolaskor.");
      } finally {
        setCheckingInId(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Stats header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Regisztralt"
          value={stats.totalRegistered}
          iconColor="text-blue-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Becsekkolva"
          value={stats.checkedIn}
          iconColor="text-green-400"
        />
        <StatCard
          icon={XCircle}
          label="Nem jelent meg"
          value={stats.noShows}
          iconColor="text-red-400"
        />
        <StatCard
          icon={Percent}
          label="Becsekkolasi rata"
          value={`${stats.checkInRate}%`}
          iconColor="text-dozis-amber"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Kereses nev vagy email alapjan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Guest table */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {search ? "Nincs talalat." : "Meg nincs regisztracio."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left p-3 text-muted-foreground font-medium">Nev</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Regisztracio</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Statusz</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Becsekkolva</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Muvelet</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => {
                const isCheckedIn = guest.checkedInAt !== null;

                return (
                  <tr
                    key={guest.registrationId}
                    className="border-b border-zinc-800/50 even:bg-zinc-800/30"
                  >
                    <td className="p-3 text-white">
                      {guestDisplayName(guest)}
                    </td>
                    <td className="p-3 text-zinc-400">{guest.email}</td>
                    <td className="p-3 text-zinc-400">
                      {format(new Date(guest.registeredAt), "yyyy. MM. dd. HH:mm", {
                        locale: hu,
                      })}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 text-green-400 px-2 py-0.5 text-xs font-medium">
                            <CheckCircle className="size-3" />
                            Becsekkolva
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-500/20 text-yellow-400 px-2 py-0.5 text-xs font-medium">
                            Regisztralt
                          </span>
                        )}
                        {guest.isFree && (
                          <span className="inline-flex items-center rounded-full bg-dozis-amber/20 text-dozis-amber px-2 py-0.5 text-xs font-medium">
                            INGYENES
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-zinc-400">
                      {isCheckedIn
                        ? format(new Date(guest.checkedInAt!), "HH:mm", {
                            locale: hu,
                          })
                        : "\u2014"}
                    </td>
                    <td className="p-3">
                      {!isCheckedIn && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckIn(guest.registrationId)}
                          disabled={isPending && checkingInId === guest.registrationId}
                        >
                          {isPending && checkingInId === guest.registrationId
                            ? "..."
                            : "Becsekkoltatás"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
