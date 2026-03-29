export const dynamic = "force-dynamic";

import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // No session: render bare (middleware redirects unauthenticated to login,
  // login/register pages have their own standalone layouts)
  if (!session?.user) {
    return <div className="min-h-screen bg-dozis-navy-deep">{children}</div>;
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  // Profile incomplete: render bare for register page
  if (!user.profileCompleted) {
    return <div className="min-h-screen bg-dozis-navy-deep">{children}</div>;
  }

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
