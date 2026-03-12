import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'
import logoSvg from '../../assets/dozis-logo.svg'

const NAV_LINKS = [
  { href: '#about', label: 'ABOUT' },
  { href: '#events', label: 'EVENTS' },
  { href: '#djs', label: 'DJS' },
  { href: '#contact', label: 'CONTACT' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.visible : styles.hidden}`}>
      <a href="#" className={styles.logoLink}>
        <img src={logoSvg} alt="DÓZIS." className={styles.logo} />
      </a>

      <button
        className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`${styles.links} ${menuOpen ? styles.menuOpen : ''}`}>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
