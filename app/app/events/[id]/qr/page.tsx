import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEventById, getUserRegistration } from "@/src/lib/events/actions";
import { getSession } from "@/src/lib/auth-utils";
import { QrDisplay } from "@/components/events/qr-display";

export default async function QrFullScreenPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  const [eventData, session] = await Promise.all([
    getEventById(id),
    getSession(),
  ]);

  if (!eventData) notFound();
  if (!session?.user) notFound();

  // Use token from URL or fetch from DB
  let qrToken = token;
  let registrationId: string | undefined;
  if (!qrToken) {
    const reg = await getUserRegistration(id, session.user.id);
    if (!reg || reg.status !== "registered") notFound();
    qrToken = reg.qrToken;
    registrationId = reg.id;
  }

  return (
    <div className="fixed inset-0 bg-white min-h-screen flex flex-col items-center justify-center z-50">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Link
          href={`/app/events/${id}`}
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft className="size-4" />
          Vissza
        </Link>
      </div>

      {/* QR display */}
      <QrDisplay
        qrToken={qrToken}
        eventId={id}
        eventName={eventData.name}
        eventDate={eventData.date}
        registrationId={registrationId}
      />
    </div>
  );
}
