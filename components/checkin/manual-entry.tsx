"use client";

import { useState, useMemo, useTransition } from "react";
import { checkInByToken, manualCheckInByRegistrationId } from "@/src/lib/checkin/actions";

type CheckInResult =
  | { success: true; type: "success"; guestName: string; isFree: boolean; newAttendanceCount: number }
  | { error: string; type: "invalid" | "wrong_event" | "not_found" | "duplicate" | "cancelled" | "unauthorized"; guestName?: string };

export interface GuestRow {
  registrationId: string;
  userId: string;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  isFree: boolean;
  registeredAt: Date | null;
  checkedInAt: Date | null;
}

interface ManualEntryProps {
  eventId: string;
  guests: GuestRow[];
  onResult: (result: CheckInResult) => void;
}

export function ManualEntry({ eventId, guests, onResult }: ManualEntryProps) {
  const [token, setToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Token submit
  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) return;

    startTransition(async () => {
      try {
        const result = await checkInByToken(trimmed, eventId);
        onResult(result as CheckInResult);
        setToken("");
      } catch {
        onResult({ error: "Halozati hiba. Probald ujra.", type: "invalid" });
      }
    });
  }

  // Guest search — case-insensitive substring match
  const filteredGuests = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return guests.filter((g) => {
      const fullName = [g.firstName, g.lastName].filter(Boolean).join(" ").toLowerCase();
      return (
        fullName.includes(q) ||
        (g.name?.toLowerCase().includes(q) ?? false) ||
        (g.email?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [searchQuery, guests]);

  function handleManualCheckIn(registrationId: string) {
    startTransition(async () => {
      try {
        const result = await manualCheckInByRegistrationId(registrationId, eventId);
        onResult(result as CheckInResult);
        setSearchQuery("");
      } catch {
        onResult({ error: "Halozati hiba. Probald ujra.", type: "invalid" });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Token input */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
          QR token beillesztese
        </h3>
        <form onSubmit={handleTokenSubmit} className="flex gap-2">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token beillesztese..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-dozis-amber"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !token.trim()}
            className="px-4 py-2 bg-dozis-amber text-black text-sm font-bold rounded-lg hover:bg-dozis-amber-light transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Becsekkoltatás"}
          </button>
        </form>
      </div>

      {/* Guest search */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
          Vendeg keresese
        </h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nev vagy email..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-dozis-amber"
        />

        {filteredGuests.length > 0 && (
          <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto">
            {filteredGuests.map((guest) => {
              const displayName =
                [guest.firstName, guest.lastName].filter(Boolean).join(" ") ||
                guest.name;
              const isCheckedIn = guest.checkedInAt !== null;

              return (
                <li
                  key={guest.registrationId}
                  className="flex items-center justify-between gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{displayName}</p>
                    <p className="text-xs text-zinc-500 truncate">{guest.email}</p>
                  </div>
                  {isCheckedIn ? (
                    <span className="text-xs text-green-400 whitespace-nowrap">
                      Becsekkolva
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleManualCheckIn(guest.registrationId)}
                      disabled={isPending || guest.status === "cancelled"}
                      className="text-xs px-3 py-1 bg-dozis-amber text-black font-bold rounded-md hover:bg-dozis-amber-light transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      Becsekkoltatás
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {searchQuery.trim() && filteredGuests.length === 0 && (
          <p className="mt-2 text-sm text-zinc-500">Nincs talalat.</p>
        )}
      </div>
    </div>
  );
}
