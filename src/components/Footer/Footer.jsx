import styles from './Footer.module.css'
import logoSvg from '../../assets/dozis-logo.svg'

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <img src={logoSvg} alt="DÓZIS." className={styles.logo} />

        <a
          href="https://www.instagram.com/dozis_bp/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.instagram}
          aria-label="Instagram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <span className={styles.venue}>DOPAMIN, BUDAPEST</span>
      </div>
    </footer>
  )
}
