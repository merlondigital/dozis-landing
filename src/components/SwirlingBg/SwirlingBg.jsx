import styles from './SwirlingBg.module.css'

export default function SwirlingBg() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className={styles.svg}
      >
        <defs>
          <filter id="heavyBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="200" />
          </filter>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 1 0 0 0 0, 1 0 0 0 0, 0 0 0 0.12 0" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="#07101a" />

        <g filter="url(#heavyBlur)" opacity="0.45">
          <circle fill="#0055aa" cx="20%" cy="20%" r="55%">
            <animate attributeName="cx" values="20%; 45%; 10%; 20%" dur="30s" repeatCount="indefinite" />
            <animate attributeName="cy" values="20%; 55%; 30%; 20%" dur="30s" repeatCount="indefinite" />
          </circle>
          <circle fill="#0088ff" cx="10%" cy="40%" r="40%">
            <animate attributeName="cx" values="10%; 35%; 0%; 10%" dur="30s" repeatCount="indefinite" />
            <animate attributeName="cy" values="40%; 15%; 60%; 40%" dur="30s" repeatCount="indefinite" />
          </circle>
          <circle fill="#b36600" cx="80%" cy="80%" r="60%">
            <animate attributeName="cx" values="80%; 55%; 90%; 80%" dur="30s" repeatCount="indefinite" />
            <animate attributeName="cy" values="80%; 45%; 75%; 80%" dur="30s" repeatCount="indefinite" />
          </circle>
          <circle fill="#ff9900" cx="90%" cy="60%" r="45%">
            <animate attributeName="cx" values="90%; 65%; 100%; 90%" dur="30s" repeatCount="indefinite" />
            <animate attributeName="cy" values="60%; 85%; 45%; 60%" dur="30s" repeatCount="indefinite" />
          </circle>
        </g>

        <rect width="100%" height="100%" filter="url(#noiseFilter)" style={{ pointerEvents: 'none' }} />
      </svg>
    </div>
  )
}
