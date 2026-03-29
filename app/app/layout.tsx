export const dynamic = "force-dynamic";

import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";
import { ProfileGate } from "@/components/app/profile-gate";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // No session: render bare (login page has its own standalone layout)
  if (!session?.user) {
    return <>{children}</>;
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  // Profile incomplete: client-side redirect to register
  if (!user.profileCompleted) {
    return <ProfileGate needsProfile={true}>{children}</ProfileGate>;
  }

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
