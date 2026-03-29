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
      router.push("/app");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-dozis-navy-deep px-4">
      {/* DOZIS Logo */}
      <h1 className="font-heading text-5xl text-dozis-amber tracking-wider mb-8">
        DOZIS.
      </h1>

      <Card className="w-full max-w-md bg-dozis-navy border-zinc-800">
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
