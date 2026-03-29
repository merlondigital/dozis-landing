"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { AppShell } from "./app-shell";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<{
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  } | null>(null);

  useEffect(() => {
    if (isPending) return;

    // No session: redirect to login (unless already on login page)
    if (!session?.user) {
      if (pathname !== "/app/login") {
        router.replace("/app/login");
      }
      return;
    }

    const user = session.user as {
      name: string;
      email: string;
      role?: string;
      profileCompleted?: boolean;
    };

    // Profile incomplete: redirect to register (unless already on register page)
    if (!user.profileCompleted && pathname !== "/app/register") {
      router.replace("/app/register");
      return;
    }

    setSessionUser(user);
  }, [session, isPending, pathname, router]);

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dozis-navy-deep">
        <p className="text-zinc-400">Betöltés...</p>
      </div>
    );
  }

  // Auth pages (login, register) render standalone
  if (!session?.user || pathname === "/app/login" || pathname === "/app/register") {
    return <>{children}</>;
  }

  // Profile incomplete — show redirect message
  if (!sessionUser?.profileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dozis-navy-deep">
        <p className="text-zinc-400">Átirányítás...</p>
      </div>
    );
  }

  // Authenticated + profile complete: render AppShell
  return (
    <AppShell user={sessionUser}>
      {children}
    </AppShell>
  );
}
