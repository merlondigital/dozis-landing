export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession, requireProfile } from "@/src/lib/auth-utils";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function RegisterPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/app/login");
  }

  const profileCheck = await requireProfile();
  if (profileCheck && !profileCheck.needsProfile) {
    redirect("/app/events");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dozis-navy-deep px-4 relative">
      {/* Subtle ambient gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0, 85, 170, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 90% 80%, rgba(179, 102, 0, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0, 136, 255, 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* DOZIS Logo */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <img src="/images/globe-logo.png" alt="DÓZIS." className="h-20 w-20 rounded-full mb-3" />
        <h1 className="font-heading text-5xl text-dozis-amber tracking-wider mb-8">
          DÓZIS.
        </h1>

        <Card className="w-full max-w-md bg-dozis-navy border-zinc-800">
          <CardHeader className="text-center pb-2">
            <h2 className="font-heading text-2xl text-white tracking-wide">
              Regisztráció
            </h2>
            <p className="text-zinc-400 text-sm font-body">
              Kérlek add meg az adataidat a folytatáshoz.
            </p>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
