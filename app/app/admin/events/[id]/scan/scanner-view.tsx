"use client";

import { useState, useCallback } from "react";
import { QrScanner } from "@/components/checkin/qr-scanner";
import { CheckinFeedback } from "@/components/checkin/checkin-feedback";
import { ManualEntry, type GuestRow } from "@/components/checkin/manual-entry";
import { playSuccessSound, playErrorSound } from "@/components/checkin/scan-sound";

type CheckInResult =
  | { success: true; type: "success"; guestName: string; isFree: boolean; newAttendanceCount: number }
  | { error: string; type: string; guestName?: string };

interface FeedbackState {
  type: "success" | "error";
  message: string;
  guestName?: string;
  isFree?: boolean;
}

interface ScannerViewProps {
  eventId: string;
  eventName: string;
  guests: GuestRow[];
  initialCheckedIn: number;
  totalRegistered: number;
}

export function ScannerView({
  eventId,
  eventName,
  guests,
  initialCheckedIn,
  totalRegistered,
}: ScannerViewProps) {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [paused, setPaused] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(initialCheckedIn);
  const [showManual, setShowManual] = useState(false);

  const handleResult = useCallback((result: CheckInResult) => {
    setPaused(true);

    if ("success" in result && result.success) {
      playSuccessSound();
      setCheckedInCount((prev) => prev + 1);
      setFeedback({
        type: "success",
        message: "Sikeres becsekkolás!",
        guestName: result.guestName,
        isFree: result.isFree,
      });
    } else if ("error" in result) {
      playErrorSound();
      setFeedback({
        type: "error",
        message: result.error,
        guestName: result.guestName,
      });
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setFeedback(null);
    setPaused(false);
  }, []);

  return (
    <div className="space-y-4">
      {/* Event header + stats */}
      <div className="text-center">
        <h1 className="text-2xl font-heading text-white tracking-wide">
          {eventName}
        </h1>
        <p className="text-lg text-dozis-amber font-bold mt-1">
          Becsekkolva: {checkedInCount} / {totalRegistered}
        </p>
      </div>

      {/* Feedback banner overlay */}
      {feedback && (
        <CheckinFeedback
          type={feedback.type}
          message={feedback.message}
          guestName={feedback.guestName}
          isFree={feedback.isFree}
          onDismiss={handleDismiss}
        />
      )}

      {/* QR Scanner */}
      <QrScanner eventId={eventId} onResult={handleResult} paused={paused} />

      {/* Manual entry toggle */}
      <div className="border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={() => setShowManual((prev) => !prev)}
          className="w-full text-sm text-muted-foreground hover:text-white transition-colors py-2"
        >
          {showManual ? "Manualis becsekkoltatás elrejtése" : "Manualis becsekkoltatás"}
        </button>

        {showManual && (
          <div className="mt-4">
            <ManualEntry
              eventId={eventId}
              guests={guests}
              onResult={handleResult}
            />
          </div>
        )}
      </div>
    </div>
  );
}
