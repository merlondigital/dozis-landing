export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/src/lib/events/actions";

export default async function AdminDashboardPage() {
  const events = await getAllEvents();
  const activeEvents = events.filter((e) => e.date > new Date());

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="font-heading text-3xl text-white tracking-wide">
        Admin Vezérlőpult
      </h2>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-body font-medium text-muted-foreground">
              Aktív események
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-heading text-dozis-amber">
              {activeEvents.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-body font-medium text-muted-foreground">
              Összes esemény
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-heading text-white">
              {events.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation cards */}
      <Card className="border-dozis-amber/20 hover:border-dozis-amber/40 transition-colors">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-body font-semibold text-white text-lg">
              Események kezelése
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Események létrehozása, szerkesztése és törlése
            </p>
          </div>
          <Link href="/app/admin/events">
            <Button>Megnyitás</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
