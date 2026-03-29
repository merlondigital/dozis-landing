export const dynamic = "force-dynamic";

import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    return <>{children}</>;
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  if (!user.profileCompleted) {
    return <>{children}</>;
  }

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
