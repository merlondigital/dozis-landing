import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <h2 className="font-heading text-2xl text-white">
        Esemeny nem talalhato
      </h2>
      <p className="text-muted-foreground">
        A keresett esemeny nem letezik vagy mar torolve lett.
      </p>
      <Link href="/app/admin/events">
        <Button variant="outline">Vissza az esemenyekhez</Button>
      </Link>
    </div>
  );
}
