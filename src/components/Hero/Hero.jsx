import styles from './Hero.module.css'
import logoSvg from '../../assets/dozis-logo.svg'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <img src={logoSvg} alt="DÓZIS." className={styles.logo} />
    </section>
  )
}
