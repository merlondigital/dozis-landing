"use client";

import { useState } from "react";
import { registerForEvent } from "@/src/lib/events/actions";
import { Button } from "@/components/ui/button";

interface RegisterButtonProps {
  eventId: string;
  onRegistered: (qrToken: string) => void;
}

export function RegisterButton({ eventId, onRegistered }: RegisterButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerForEvent(eventId);
      if ("error" in result) {
        setError(result.error as string);
      } else if ("success" in result && result.qrToken) {
        onRegistered(result.qrToken as string);
      }
    } catch {
      setError("Hiba történt a regisztráció során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-dozis-amber text-black font-medium hover:bg-dozis-amber-light text-base py-6"
        size="lg"
      >
        {loading ? "Regisztráció..." : "Regisztráció"}
      </Button>
      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
