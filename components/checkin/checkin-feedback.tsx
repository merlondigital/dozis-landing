"use client";

import { useEffect } from "react";

interface CheckinFeedbackProps {
  type: "success" | "error";
  message: string;
  guestName?: string;
  isFree?: boolean;
  onDismiss: () => void;
}

export function CheckinFeedback({
  type,
  message,
  guestName,
  isFree,
  onDismiss,
}: CheckinFeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Haptic feedback on error
  useEffect(() => {
    if (type === "error" && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(200);
    }
  }, [type]);

  const bgColor =
    type === "success" ? "bg-green-500/90" : "bg-red-500/90";

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 ${bgColor} text-white px-4 py-4 shadow-lg animate-in slide-in-from-top duration-200`}
    >
      <div className="max-w-md mx-auto text-center">
        {type === "success" ? (
          <>
            <p className="text-lg font-bold">{guestName}</p>
            <p className="text-sm opacity-90">{message}</p>
            {isFree && (
              <p className="mt-1 text-sm font-bold text-dozis-amber bg-black/20 inline-block px-3 py-1 rounded-full">
                INGYENES ESEMENY!
              </p>
            )}
          </>
        ) : (
          <>
            {guestName && <p className="text-lg font-bold">{guestName}</p>}
            <p className="text-sm font-medium">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
