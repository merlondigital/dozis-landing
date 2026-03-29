"use client";

import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";

interface QrDisplayProps {
  qrToken: string;
  eventName: string;
  eventDate: Date;
}

export function QrDisplay({ qrToken, eventName, eventDate }: QrDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
        <h3 className="text-black font-heading text-xl text-center mb-1">
          {eventName}
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          {format(eventDate, "yyyy. MMMM d., HH:mm", { locale: hu })}
        </p>

        <QRCodeSVG
          value={qrToken}
          size={280}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
        />

        <p className="text-gray-500 text-sm mt-6">
          Mutasd meg a bejaratnal
        </p>
      </div>
    </div>
  );
}
