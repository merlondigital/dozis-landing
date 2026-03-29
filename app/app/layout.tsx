export const dynamic = "force-dynamic";

import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // No session or error: render children bare (middleware handles redirect to login)
  if (!session?.user) {
    return <div className="min-h-screen bg-dozis-navy-deep">{children}</div>;
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  // Profile incomplete: render bare (register page has its own layout)
  if (!user.profileCompleted) {
    return <div className="min-h-screen bg-dozis-navy-deep">{children}</div>;
  }

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
