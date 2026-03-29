export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getSession();
  } catch {
    // getSession may fail during build or on login page where CF context is unavailable
    session = null;
  }

  // If no session, render children without AppShell (login page handles its own layout)
  if (!session?.user) {
    return <>{children}</>;
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  // If profile is not completed, render without AppShell (register page handles its own layout)
  if (!user.profileCompleted) {
    return <>{children}</>;
  }

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
