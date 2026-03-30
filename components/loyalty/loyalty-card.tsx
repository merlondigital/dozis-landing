import { Gift } from "lucide-react";

interface LoyaltyCardProps {
  attendanceCount: number;
  nextIsFree: boolean;
}

export function LoyaltyCard({ attendanceCount, nextIsFree }: LoyaltyCardProps) {
  // 5-event cycle: dots 0..4
  const dots = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="bg-dozis-navy rounded-xl p-6 border border-zinc-800">
      <h3 className="font-heading text-xl text-dozis-amber mb-4">
        Hűségprogram
      </h3>

      {/* 5-dot progress */}
      <div className="flex items-center justify-center gap-3">
        {dots.map((i) => {
          const isFilled = i < attendanceCount;
          const isLast = i === 4;

          return (
            <div
              key={i}
              className={`flex items-center justify-center rounded-full transition-colors ${
                isLast
                  ? isFilled
                    ? "size-10 bg-dozis-amber text-black"
                    : "size-10 border-2 border-zinc-600 text-zinc-600"
                  : isFilled
                    ? "size-8 bg-dozis-amber"
                    : "size-8 border-2 border-zinc-600"
              }`}
            >
              {isLast && <Gift className="size-4" />}
            </div>
          );
        })}
      </div>

      {/* Progress text */}
      <p className="text-center text-zinc-400 text-sm mt-3">
        {nextIsFree ? "5 / 5 esemény" : `${attendanceCount} / 5 esemény`}
      </p>

      {/* Next-free label or encouragement */}
      {nextIsFree ? (
        <p className="text-center text-dozis-amber font-heading text-lg mt-2 animate-pulse">
          Következő ingyenes!
        </p>
      ) : attendanceCount === 0 ? (
        <p className="text-center text-zinc-500 text-xs mt-2">
          Vegyél részt eseményeken és minden 5. alkalommal ingyenes belépőt kapsz!
        </p>
      ) : null}
    </div>
  );
}
