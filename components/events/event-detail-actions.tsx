"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterButton } from "./register-button";
import { QrDisplay } from "./qr-display";
import { cancelRegistration } from "@/src/lib/events/actions";

interface EventDetailActionsProps {
  eventId: string;
  eventName: string;
  eventDate: Date;
  registration: {
    id: string;
    qrToken: string;
  } | null;
}

export function EventDetailActions({
  eventId,
  eventName,
  eventDate,
  registration,
}: EventDetailActionsProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleRegistered = (qrToken: string) => {
    router.push(`/app/events/${eventId}/qr?token=${encodeURIComponent(qrToken)}`);
  };

  const handleCancel = async () => {
    if (!registration) return;
    if (!confirm("Biztosan lemondod a regisztraciot?")) return;

    setCancelling(true);
    setCancelError(null);

    try {
      const result = await cancelRegistration(registration.id);
      if ("error" in result) {
        setCancelError(result.error as string);
      } else {
        router.refresh();
      }
    } catch {
      setCancelError("Hiba tortent a lemondas soran.");
    } finally {
      setCancelling(false);
    }
  };

  if (registration) {
    return (
      <div className="space-y-6">
        <QrDisplay
          qrToken={registration.qrToken}
          eventName={eventName}
          eventDate={eventDate}
        />

        <div className="flex flex-col items-center gap-3">
          <a
            href={`/app/events/${eventId}/qr?token=${encodeURIComponent(registration.qrToken)}`}
            className="text-dozis-amber hover:text-dozis-amber-light transition-colors text-sm font-medium"
          >
            Teljes kepernyo
          </a>

          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-zinc-500 hover:text-red-400 transition-colors text-sm"
          >
            {cancelling ? "Lemondas..." : "Regisztracio lemondasa"}
          </button>
          {cancelError && (
            <p className="text-red-400 text-xs">{cancelError}</p>
          )}
        </div>
      </div>
    );
  }

  return <RegisterButton eventId={eventId} onRegistered={handleRegistered} />;
}
