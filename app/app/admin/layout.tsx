export const dynamic = "force-dynamic";

import { requireAdmin } from "@/src/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  if (!session) {
    // Regular user trying to access admin - redirect to dashboard
    redirect("/app/events");
  }

  return (
    <div>
      <div className="bg-dozis-navy border-b border-zinc-800 px-4 py-2">
        <span className="text-xs text-dozis-amber font-body uppercase tracking-widest">
          Admin Felület
        </span>
      </div>
      {children}
    </div>
  );
}
