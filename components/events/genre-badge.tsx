import { cn } from "@/lib/utils";

const GENRE_COLORS: Record<string, string> = {
  "UK Garage": "bg-amber-500/20 text-amber-400",
  "Club Trance": "bg-blue-500/20 text-blue-400",
  "Tech House": "bg-purple-500/20 text-purple-400",
  "Deep House": "bg-cyan-500/20 text-cyan-400",
  "Afro House": "bg-green-500/20 text-green-400",
  Bouncy: "bg-pink-500/20 text-pink-400",
};

export function GenreBadge({ genre }: { genre: string }) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        GENRE_COLORS[genre] ?? "bg-zinc-500/20 text-zinc-400"
      )}
    >
      {genre}
    </span>
  );
}

export function parseGenreTags(genreTags: string | null | undefined): string[] {
  return genreTags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
}
