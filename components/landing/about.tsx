"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function About() {
  const ref1 = useScrollReveal();
  const ref2 = useScrollReveal({ delay: 150 });

  return (
    <section id="about" className="relative py-40 px-8 flex items-center justify-center text-center max-md:py-24 max-md:px-6">
      <div className="max-w-[680px]">
        <p
          ref={ref1 as React.RefObject<HTMLParagraphElement>}
          className="font-heading text-[clamp(1.4rem,3vw,2.2rem)] text-white leading-[1.4] mb-8"
        >
          Budapesti elektronikus zenei kollektíva.
        </p>
        <p
          ref={ref2 as React.RefObject<HTMLParagraphElement>}
          className="text-[clamp(0.9rem,1.2vw,1.05rem)] leading-[1.9] text-white/60 font-light"
        >
          A DÓZIS. a budapesti underground elektronikus színtér szívéből született.
          Minden estünk egy adag tiszta energia — a zenétől a közönségig,
          a hangoktól a rezgésekig.
        </p>
      </div>
    </section>
  );
}
