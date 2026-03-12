import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './About.module.css'

export default function About() {
  const ref1 = useScrollReveal()
  const ref2 = useScrollReveal({ delay: 150 })

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <p className={styles.lead} ref={ref1}>
          Budapesti elektronikus zenei kollektíva.
          <br />
          Négy DJ. Egy küldetés.
        </p>
        <p className={styles.body} ref={ref2}>
          A DÓZIS. a budapesti underground elektronikus színtér szívéből született.
          Minden estünk egy adag tiszta energia — a zenétől a közönségig,
          a hangoktól a rezgésekig.
        </p>
      </div>
    </section>
  )
}
