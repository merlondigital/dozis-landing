export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/auth-utils";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/app/login");
  }

  const user = session.user as {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
