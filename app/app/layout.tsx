export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Determine current path from headers
  const hdrs = await headers();
  const pathname = hdrs.get("x-nextjs-page") || hdrs.get("x-invoke-path") || "";
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

  // No session: auth pages render standalone, everything else redirects to login
  if (!session?.user) {
    if (isAuthPage) {
      return <>{children}</>;
    }
    redirect("/app/login");
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  // Profile incomplete: register page renders standalone, everything else redirects to register
  if (!user.profileCompleted) {
    if (pathname.includes("/register")) {
      return <>{children}</>;
    }
    redirect("/app/register");
  }

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
