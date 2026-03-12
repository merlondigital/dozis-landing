import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Events.module.css'

const GENRES = [
  { name: 'UK GARAGE', style: 'ukGarage' },
  { name: 'CLUB TRANCE', style: 'clubTrance' },
  { name: 'TECH HOUSE', style: 'techHouse' },
  { name: 'DEEP HOUSE', style: 'deepHouse' },
  { name: 'AFRO HOUSE', style: 'afroHouse' },
  { name: 'BOUNCY', style: 'bouncy' },
]

export default function Events() {
  const headingRef = useScrollReveal()

  return (
    <section id="events" className={styles.events}>
      <div className={styles.container}>
        <h2 className={styles.heading} ref={headingRef}>Stílusok</h2>

        <div className={styles.genres}>
          {GENRES.map((genre, i) => (
            <GenreRow key={genre.name} genre={genre} delay={i * 80} />
          ))}
        </div>

        <div className={styles.nextEvent}>
          <span className={styles.date}>04.02.</span>
          <span className={styles.divider} />
          <span className={styles.venue}>DOPAMIN</span>
        </div>
      </div>
    </section>
  )
}

function GenreRow({ genre, delay }) {
  const ref = useScrollReveal({ delay })

  return (
    <div className={`${styles.genreRow} ${styles[genre.style]}`} ref={ref}>
      <span className={styles.genreName}>{genre.name}</span>
    </div>
  )
}
