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
    redirect("/app");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dozis-navy-deep px-4">
      {/* DOZIS Logo */}
      <h1 className="font-heading text-5xl text-dozis-amber tracking-wider mb-8">
        DOZIS.
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
  );
}
