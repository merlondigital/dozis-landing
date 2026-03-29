"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const DJS = ["POLOSAI", "PETRUS", "DAVE"] as const;

export default function DJs() {
  return (
    <section id="djs" className="relative py-32 px-8 flex items-center justify-center max-md:py-20 max-md:px-6">
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 max-w-[900px] max-md:flex-col max-md:items-center max-md:gap-2">
        {DJS.map((name, i) => (
          <DJName key={name} name={name} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

function DJName({ name, delay }: { name: string; delay: number }) {
  const ref = useScrollReveal({ delay });
  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] text-white opacity-[0.12] tracking-[0.05em] leading-none transition-all duration-500 cursor-default hover:opacity-90 hover:[text-shadow:0_0_30px_rgba(212,160,23,0.15),0_0_60px_rgba(212,160,23,0.08)]"
    >
      {name}
    </span>
  );
}
