"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProfileGate({
  needsProfile,
  children,
}: {
  needsProfile: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (needsProfile) {
      router.replace("/app/register");
    }
  }, [needsProfile, router]);

  if (needsProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dozis-navy-deep">
        <p className="text-zinc-400">Átirányítás...</p>
      </div>
    );
  }

  return <>{children}</>;
}
