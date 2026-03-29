import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventForm, type EventFormData } from "@/components/admin/event-form";
import { getEventById } from "@/src/lib/events/actions";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  // Transform DB event to form data
  const initialData: EventFormData = {
    name: event.name,
    date: event.date,
    venue: event.venue,
    description: event.description ?? undefined,
    genreTags: event.genreTags ? event.genreTags.split(",").map((g) => g.trim()) : [],
    imageUrl: event.imageUrl ?? undefined,
  };

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
            Esemény szerkesztése
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm mode="edit" initialData={initialData} eventId={event.id} />
        </CardContent>
      </Card>
    </div>
  );
}
