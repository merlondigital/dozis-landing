import styles from './DozisLogo.module.css'

export default function DozisLogo({ className = '', size = 'hero' }) {
  const sizeClass = styles[size] || styles.hero

  return (
    <svg
      className={`${styles.logo} ${sizeClass} ${className}`}
      viewBox="0 0 600 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="DÓZIS."
    >
      <defs>
        {/* Spray paint glow effect */}
        <filter id="spray-glow" x="-20%" y="-40%" width="140%" height="180%">
          {/* Base blur for spray-paint spread */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
          {/* Wider glow */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
          {/* Even wider atmospheric glow */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
          {/* Noise for spray-paint grain */}
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
          {/* Merge everything */}
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
        className={styles.textScatter}
        filter="url(#spray-scatter)"
      >
        DÓZIS.
      </text>

      {/* Main spray-paint text with glow */}
      <text
        x="300" y="88"
        textAnchor="middle"
        className={styles.textMain}
        filter="url(#spray-glow)"
      >
        DÓZIS.
      </text>
    </svg>
  )
}
