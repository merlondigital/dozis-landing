"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEvent, updateEvent } from "@/src/lib/events/actions";
import {
  createEventSchema,
  updateEventSchema,
  GENRE_OPTIONS,
  type CreateEventInput,
  type UpdateEventInput,
} from "@/src/lib/events/validation";

// Genre badge color mapping
const GENRE_COLORS: Record<string, string> = {
  "UK Garage": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Club Trance": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Tech House": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Deep House": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Afro House": "bg-green-500/20 text-green-400 border-green-500/30",
  "Bouncy": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export interface EventFormData {
  name: string;
  date: Date;
  venue: string;
  description?: string;
  genreTags: string[];
  imageUrl?: string;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: EventFormData;
  eventId?: string;
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EventForm({ mode, initialData, eventId }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData?.name ?? "");
  const [date, setDate] = useState(
    initialData?.date ? formatDateForInput(initialData.date) : ""
  );
  const [venue, setVenue] = useState(
    initialData?.venue ?? "DOPAMIN, Budapest"
  );
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [genreTags, setGenreTags] = useState<string[]>(
    initialData?.genreTags ?? []
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function toggleGenre(genre: string) {
    setGenreTags((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = {
      name,
      date: date ? new Date(date) : undefined,
      venue,
      description: description || undefined,
      genreTags,
      imageUrl: imageUrl || undefined,
    };

    // Client-side validation
    const schema = mode === "edit" ? updateEventSchema : createEventSchema;
    const dataToValidate =
      mode === "edit" ? { ...formData, id: eventId } : formData;
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      try {
        let response;
        if (mode === "edit") {
          response = await updateEvent(result.data as UpdateEventInput);
        } else {
          response = await createEvent(result.data as CreateEventInput);
        }

        if ("error" in response && response.error) {
          setError(response.error);
          return;
        }

        router.push("/app/admin/events");
        router.refresh();
      } catch {
        setError("Varatlan hiba tortent. Probald ujra.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Esemenynev *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Esemenynev"
          required
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-400">{fieldErrors.name}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Datum es idopont *</Label>
        <input
          id="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
        {fieldErrors.date && (
          <p className="text-sm text-red-400">{fieldErrors.date}</p>
        )}
      </div>

      {/* Venue */}
      <div className="space-y-2">
        <Label htmlFor="venue">Helyszin *</Label>
        <Input
          id="venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Helyszin"
          required
        />
        {fieldErrors.venue && (
          <p className="text-sm text-red-400">{fieldErrors.venue}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Leiras</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Leiras (opcionalis)"
          maxLength={2000}
          rows={4}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y"
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/2000
        </p>
        {fieldErrors.description && (
          <p className="text-sm text-red-400">{fieldErrors.description}</p>
        )}
      </div>

      {/* Genre Tags */}
      <div className="space-y-2">
        <Label>Mufajok *</Label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((genre) => {
            const selected = genreTags.includes(genre);
            const colors = GENRE_COLORS[genre] ?? "bg-zinc-500/20 text-zinc-400";
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`rounded-full px-3 py-1 text-sm font-medium border transition-all ${
                  selected
                    ? colors
                    : "bg-zinc-800/50 text-zinc-500 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
        {genreTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {genreTags.map((genre) => (
              <span
                key={genre}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  GENRE_COLORS[genre] ?? "bg-zinc-500/20 text-zinc-400"
                }`}
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        {fieldErrors.genreTags && (
          <p className="text-sm text-red-400">{fieldErrors.genreTags}</p>
        )}
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Kep URL</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Kep URL (opcionalis)"
          type="url"
        />
        {fieldErrors.imageUrl && (
          <p className="text-sm text-red-400">{fieldErrors.imageUrl}</p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Mentes..."
            : mode === "create"
              ? "Esemeny letrehozasa"
              : "Valtozasok mentese"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/app/admin/events")}
          disabled={isPending}
        >
          Megse
        </Button>
      </div>
    </form>
  );
}
