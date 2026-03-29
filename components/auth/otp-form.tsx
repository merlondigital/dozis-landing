"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { verifyEmail, sendVerificationOtp } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface OtpFormProps {
  email: string;
  onBack: () => void;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function OtpForm({ email, onBack }: OtpFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const submitOtp = useCallback(
    async (code: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await verifyEmail({
          email,
          otp: code,
        });

        if (result.error) {
          setError(result.error.message || "Ervenytelen kod. Probald ujra.");
          setLoading(false);
          return;
        }

        // Successful verification - redirect to app
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl") || "/app";
        router.push(callbackUrl);
      } catch {
        setError("Hiba tortent. Probald ujra.");
        setLoading(false);
      }
    },
    [email, router]
  );

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    const code = otp.join("");
    if (code.length === 6 && otp.every((d) => d !== "")) {
      submitOtp(code);
    }
  }, [otp, submitOtp]);

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmpty = newOtp.findIndex((d) => d === "");
    inputRefs.current[nextEmpty >= 0 ? nextEmpty : 5]?.focus();
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);

    try {
      const result = await sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        setError(result.error.message || "Nem sikerult ujra kuldeni a kodot.");
      } else {
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Hiba tortent. Probald ujra.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-zinc-400 text-sm">
          Kodot kuldtunk: <span className="text-white font-medium">{maskEmail(email)}</span>
        </p>
      </div>

      {/* 6-digit OTP inputs */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading}
            className="w-12 h-14 text-center text-2xl font-mono font-bold bg-zinc-900 border-2 border-zinc-700 rounded-lg text-white focus:border-dozis-amber focus:outline-none focus:ring-1 focus:ring-dozis-amber disabled:opacity-50 transition-colors"
            autoFocus={index === 0}
            autoComplete={index === 0 ? "one-time-code" : "off"}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {loading && (
        <p className="text-sm text-zinc-400 text-center">Ellenorzes...</p>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={resending || loading}
          className="text-dozis-amber hover:text-dozis-amber-light hover:bg-transparent"
        >
          {resending ? "Kuldes..." : "Uj kod kerese"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={loading}
          className="text-zinc-500 hover:text-white hover:bg-transparent"
        >
          Vissza
        </Button>
      </div>
    </div>
  );
}
