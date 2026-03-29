import { z } from "zod";

export const GENRE_OPTIONS = [
  "UK Garage",
  "Club Trance",
  "Tech House",
  "Deep House",
  "Afro House",
  "Bouncy",
] as const;

export const createEventSchema = z.object({
  name: z.string().min(2, "Az eseménynév legalább 2 karakter").max(100),
  date: z.coerce
    .date()
    .refine((d) => d > new Date(), "A dátum a jövőben kell legyen"),
  venue: z.string().min(2).max(200).default("DOPAMIN, Budapest"),
  description: z.string().max(2000).optional(),
  genreTags: z
    .array(z.enum(GENRE_OPTIONS))
    .min(1, "Legalább egy műfaj kötelező"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
