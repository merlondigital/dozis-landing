import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './DJs.module.css'

const DJS = ['POLOSAI', 'PETRUS', 'DAVE']

export default function DJs() {
  return (
    <section id="djs" className={styles.djs}>
      <div className={styles.container}>
        {DJS.map((name, i) => (
          <DJName key={name} name={name} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}

function DJName({ name, delay }) {
  const ref = useScrollReveal({ delay })
  return (
    <span className={styles.name} ref={ref}>{name}</span>
  )
}
