import { useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import Intro from './components/Intro'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import PythonShowcase from './components/PythonShowcase'
import StarshipSection from './components/StarshipSection'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import { useSmoothScroll } from './lib/useSmoothScroll'

export default function App() {
  const [entered, setEntered] = useState(false)
  const reduce = useReducedMotion()
  useSmoothScroll()

  // Scroll-velocity tilt: the page leans very slightly in the scroll direction.
  // The transform origin tracks the viewport centre so distant sections don't
  // get displaced; a hair of scale hides the sub-pixel rotation gap at edges.
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothV = useSpring(velocity, { stiffness: 90, damping: 40, restDelta: 1 })
  const tilt = useTransform(smoothV, [-2500, 2500], [-0.3, 0.3], { clamp: true })
  const originY = useTransform(scrollY, (v) => v + (typeof window !== 'undefined' ? window.innerHeight / 2 : 400))
  const transformOrigin = useMotionTemplate`50% ${originY}px`

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <Intro onFinish={() => setEntered(true)} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        aria-hidden={!entered}
        style={reduce ? undefined : { rotate: tilt, scale: 1.012, transformOrigin }}
      >
        <Hero />
        <About />
        <PythonShowcase />
        <StarshipSection />
        <Footer />
      </motion.main>
    </>
  )
}
