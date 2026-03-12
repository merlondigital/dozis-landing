import SwirlingBg from './components/SwirlingBg/SwirlingBg'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Events from './components/Events/Events'
import DJs from './components/DJs/DJs'
import Footer from './components/Footer/Footer'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <SwirlingBg />
      <Navbar />
      <main className={styles.main}>
        <Hero />
        <About />
        <Events />
        <DJs />
      </main>
      <Footer />
    </div>
  )
}

export default App
