"use client";

import { useState } from "react";
import { sendVerificationOtp } from "@/src/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onOtpSent: (email: string) => void;
}

export function LoginForm({ onOtpSent }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Kerlek adj meg egy ervenyes email cimet.");
      return;
    }

    setLoading(true);
    try {
      const result = await sendVerificationOtp({
        email: trimmed,
        type: "sign-in",
      });

      if (result.error) {
        setError(result.error.message || "Hiba tortent. Probald ujra.");
        return;
      }

      onOtpSent(trimmed);
    } catch {
      setError("Hiba tortent. Probald ujra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email cim
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="pelda@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          autoComplete="email"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-dozis-amber text-black hover:bg-dozis-amber-light font-body font-semibold"
        size="lg"
      >
        {loading ? "Kuldes..." : "Kod kuldese"}
      </Button>
    </form>
  );
}
