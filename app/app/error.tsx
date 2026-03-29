"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[app error]", error.message);
    // On any app error, redirect to login
    router.push("/app/login");
  }, [error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dozis-navy-deep">
      <div className="text-center">
        <h2 className="font-heading text-2xl text-dozis-amber mb-2">Hiba történt</h2>
        <p className="text-zinc-400 mb-4">Átirányítás a bejelentkezéshez...</p>
      </div>
    </div>
  );
}
