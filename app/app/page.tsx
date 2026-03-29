import { requireProfile } from "@/src/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const result = await requireProfile();
  if (!result) redirect("/app/login");
  if (result.needsProfile) redirect("/app/register");

  const { session } = result;
  const user = session.user as { firstName?: string; name: string };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-3xl text-white tracking-wide">
          Szia, {user.firstName || user.name}!
        </h2>
        <p className="text-zinc-400 mt-2">
          Udvozlunk a DOZIS. alkalmazasban.
        </p>
      </div>

      {/* Placeholder cards for upcoming features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dozis-navy rounded-xl p-6 border border-zinc-800">
          <h3 className="font-heading text-xl text-dozis-amber mb-2">Esemenyek</h3>
          <p className="text-zinc-400 text-sm">Hamarosan...</p>
        </div>
        <div className="bg-dozis-navy rounded-xl p-6 border border-zinc-800">
          <h3 className="font-heading text-xl text-dozis-amber mb-2">Husegprogram</h3>
          <p className="text-zinc-400 text-sm">Hamarosan...</p>
        </div>
      </div>
    </div>
  );
}
