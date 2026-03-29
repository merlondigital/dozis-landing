export default function Hero() {
  return (
    <section className="relative w-full h-dvh flex items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/dozis-logo.svg"
        alt="DOZIS."
        className="w-[clamp(320px,45vw,620px)] h-auto pointer-events-none select-none"
      />
    </section>
  );
}
