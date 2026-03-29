export default function GrainOverlay() {
  return (
    <div
      className="fixed -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none z-[9999] opacity-[0.06] motion-safe:animate-grain-shift"
      aria-hidden="true"
    >
      <svg width="100%" height="100%">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
