"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const GENRES = [
  { name: "UK GARAGE", animation: "animate-genre-swing" },
  { name: "CLUB TRANCE", animation: "animate-genre-pulse" },
  { name: "TECH HOUSE", animation: "animate-genre-groove" },
  { name: "DEEP HOUSE", animation: "animate-genre-wave" },
  { name: "AFRO HOUSE", animation: "animate-genre-rhythm" },
  { name: "BOUNCY", animation: "animate-genre-bounce" },
] as const;

export default function Events() {
  const headingRef = useScrollReveal();

  return (
    <section id="events" className="relative py-32 px-8 text-center max-md:py-20 max-md:px-6">
      <div className="max-w-[600px] mx-auto">
        <h2
          ref={headingRef as React.RefObject<HTMLHeadingElement>}
          className="text-[clamp(0.7rem,1vw,0.85rem)] tracking-[0.3em] text-white/30 font-normal mb-12"
          style={{ fontFamily: "var(--font-body)", textTransform: "uppercase" }}
        >
          Stílusok
        </h2>

        <div className="flex flex-col items-center gap-2 mb-20">
          {GENRES.map((genre, i) => (
            <GenreRow key={genre.name} genre={genre} delay={i * 80} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <span className="font-heading text-[clamp(2.5rem,5vw,4rem)] text-white tracking-[0.02em]">
            04.02.
          </span>
          <span className="w-10 h-px bg-white/15" />
          <span
            className="text-[0.8rem] tracking-[0.25em] text-white/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            DOPAMIN
          </span>
        </div>
      </div>
    </section>
  );
}

function GenreRow({ genre, delay }: { genre: typeof GENRES[number]; delay: number }) {
  const ref = useScrollReveal({ delay });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full text-center py-3 border-b border-white/[0.04] last:border-b-0 group"
    >
      <span
        className={`font-heading text-[clamp(1.4rem,3vw,2rem)] tracking-[0.12em] text-white/50 inline-block transition-opacity duration-400 group-hover:opacity-100 motion-safe:${genre.animation}`}
      >
        {genre.name}
      </span>
    </div>
  );
}
