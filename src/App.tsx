import { useState } from 'react'
import { motion } from 'framer-motion'
import Intro from './components/Intro'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import PythonShowcase from './components/PythonShowcase'
import StarshipSection from './components/StarshipSection'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import { useSmoothScroll } from './lib/useSmoothScroll'

export default function App() {
  const [entered, setEntered] = useState(false)
  useSmoothScroll()

  return (
    <>
      <CustomCursor />
      <Intro onFinish={() => setEntered(true)} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        aria-hidden={!entered}
      >
        <Nav />
        <Hero />
        <About />
        <PythonShowcase />
        <StarshipSection />
        <Footer />
      </motion.main>
    </>
  )
}
