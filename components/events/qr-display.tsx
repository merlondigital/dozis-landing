"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { WifiOff } from "lucide-react";
import { cacheQrData } from "@/lib/qr-cache";

function AppleWalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6h10M7 10h10M7 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface QrDisplayProps {
  qrToken: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  registrationId?: string;
}

export function QrDisplay({ qrToken, eventId, eventName, eventDate, registrationId }: QrDisplayProps) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initialize offline state (SSR guard)
    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Cache QR data on mount
  useEffect(() => {
    cacheQrData({
      qrToken,
      eventId,
      eventName,
      eventDate: eventDate.toISOString(),
    });
  }, [qrToken, eventId, eventName, eventDate]);

  return (
    <div className="flex flex-col items-center w-full">
      {isOffline && (
        <div className="bg-amber-500/20 text-amber-400 rounded-lg px-4 py-2 text-sm flex items-center gap-2 mb-4 w-full max-w-sm mx-auto">
          <WifiOff className="size-4 shrink-0" />
          Offline mod — mentett QR kod
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center w-full max-w-sm mx-auto">
        <h3 className="text-black font-heading text-xl text-center mb-1">
          {eventName}
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          {format(eventDate, "yyyy. MMMM d., HH:mm", { locale: hu })}
        </p>

        <div className="w-full max-w-[280px]">
          <QRCodeSVG
            value={qrToken}
            size={280}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
            className="w-full h-auto"
          />
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Mutasd meg a bejaratnal
        </p>
      </div>

      {registrationId && (
        <a
          href={`/api/wallet/${registrationId}`}
          className="mt-4 inline-flex items-center gap-2 bg-black text-white rounded-xl px-5 py-3 text-sm font-medium hover:bg-gray-900 transition-colors min-h-[44px]"
        >
          <AppleWalletIcon />
          Hozzáadás az Apple Wallet-hez
        </a>
      )}
    </div>
  );
}
