"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dozis-navy-deep px-4">
      <div className="text-center max-w-md">
        <h2 className="font-heading text-2xl text-dozis-amber mb-2">
          Hiba történt
        </h2>
        <p className="text-zinc-400 mb-6 text-sm">
          Valami nem sikerült. Próbáld újra, vagy lépj vissza a főoldalra.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="bg-dozis-amber text-black hover:bg-dozis-amber-light">
            Újrapróbálás
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/app/events")}
          >
            Vissza az eseményekhez
          </Button>
        </div>
      </div>
    </div>
  );
}
