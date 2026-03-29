"use client";

import Link from "next/link";
import { useSession } from "@/src/lib/auth-client";

export function DashboardContent() {
  const { data: session } = useSession();
  const user = session?.user as {
    firstName?: string;
    name: string;
    id: string;
  } | undefined;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-3xl text-white tracking-wide">
          Szia, {user?.firstName || user?.name || ""}!
        </h2>
        <p className="text-zinc-400 mt-2">
          Üdvözlünk a DÓZIS. alkalmazásban.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/app/events"
          className="bg-dozis-navy rounded-xl p-6 border border-zinc-800 hover:border-zinc-600 transition-colors block"
        >
          <h3 className="font-heading text-xl text-dozis-amber mb-2">
            Események
          </h3>
          <p className="text-zinc-400 text-sm">
            Böngészd az eseményeket és regisztrálj.
          </p>
        </Link>

        <div className="bg-dozis-navy rounded-xl p-6 border border-zinc-800">
          <h3 className="font-heading text-xl text-dozis-amber mb-2">
            Hűségprogram
          </h3>
          <p className="text-zinc-400 text-sm">
            Minden 5. esemény ingyenes!
          </p>
        </div>
      </div>
    </div>
  );
}
