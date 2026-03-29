import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <Link
        href="/app/admin/events"
        className="text-sm text-muted-foreground hover:text-white transition-colors"
      >
        &larr; Vissza az eseményekhez
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-white tracking-wide">
            Új esemény létrehozása
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
