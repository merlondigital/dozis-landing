import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <h2 className="font-heading text-2xl text-white">
        Esemény nem található
      </h2>
      <p className="text-muted-foreground">
        A keresett esemény nem létezik vagy már törölve lett.
      </p>
      <Link href="/app/admin/events">
        <Button variant="outline">Vissza az eseményekhez</Button>
      </Link>
    </div>
  );
}
