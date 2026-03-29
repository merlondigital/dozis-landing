const SIZE_CLASSES = {
  hero: "w-[clamp(320px,55vw,700px)] h-auto",
  nav: "w-[120px] h-auto",
  footer: "w-[100px] h-auto",
} as const;

type LogoSize = keyof typeof SIZE_CLASSES;

interface DozisLogoProps {
  className?: string;
  size?: LogoSize;
}

export default function DozisLogo({ className = "", size = "hero" }: DozisLogoProps) {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <svg
      className={`block select-none ${sizeClass} ${className}`}
      viewBox="0 0 600 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="DOZIS."
    >
      <defs>
        {/* Spray paint glow effect */}
        <filter id="spray-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Particle scatter for spray edges */}
        <filter id="spray-scatter" x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" seed="5" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
          <feComponentTransfer in="grayNoise" result="threshNoise">
            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 1 1" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="threshNoise" operator="in" result="scattered" />
          <feGaussianBlur in="scattered" stdDeviation="1.5" result="scatteredBlur" />
          <feMerge>
            <feMergeNode in="scatteredBlur" />
          </feMerge>
        </filter>
      </defs>

      {/* Scattered spray particles layer */}
      <text
        x="300" y="88"
        textAnchor="middle"
        className="font-heading text-[100px] fill-white/40 tracking-[0.04em]"
        style={{ fontFamily: "'Anton', sans-serif", fontSize: 100, fill: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}
        filter="url(#spray-scatter)"
      >
        DOZIS.
      </text>

      {/* Main spray-paint text with glow */}
      <text
        x="300" y="88"
        textAnchor="middle"
        className="font-heading text-[100px] fill-white tracking-[0.04em]"
        style={{ fontFamily: "'Anton', sans-serif", fontSize: 100, fill: "#ffffff", letterSpacing: "0.04em" }}
        filter="url(#spray-glow)"
      >
        DOZIS.
      </text>
    </svg>
  );
}
