"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { OtpForm } from "@/components/auth/otp-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState<string | null>(null);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user && !isPending) {
      window.location.href = "/app/events";
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dozis-navy-deep">
        <p className="text-zinc-400">Betöltés...</p>
      </div>
    );
  }

  if (session?.user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dozis-navy-deep px-4 relative">
      {/* Subtle ambient gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0, 85, 170, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 90% 80%, rgba(179, 102, 0, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0, 136, 255, 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* DOZIS Logo */}
      <div className="mb-8 flex flex-col items-center relative z-10">
        <img src="/images/globe-logo.png" alt="DÓZIS." className="h-20 w-20 rounded-full mb-3" />
        <h1 className="font-heading text-4xl text-dozis-amber tracking-wider">
          DÓZIS.
        </h1>
      </div>

      <Card className="w-full max-w-md bg-dozis-navy border-zinc-800 relative z-10">
        <CardHeader className="text-center pb-2">
          <h2 className="font-heading text-2xl text-white tracking-wide">
            {email ? "Kód megadása" : "Bejelentkezés"}
          </h2>
          {!email && (
            <p className="text-zinc-400 text-sm font-body">
              Add meg az email címed és küldünk egy kódot.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {email ? (
            <OtpForm email={email} onBack={() => setEmail(null)} />
          ) : (
            <LoginForm onOtpSent={setEmail} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
