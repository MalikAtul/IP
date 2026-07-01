import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

let lenisSingleton: Lenis | null = null

/** Access the shared Lenis instance (for programmatic scrollTo). */
export function getLenis(): Lenis | null {
  return lenisSingleton
}

/**
 * Initialise Lenis inertia scrolling and wire it into GSAP's ScrollTrigger +
 * ticker. Disabled (native scroll) when the user prefers reduced motion.
 */
export function useSmoothScroll(): void {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenisSingleton = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onRaf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.destroy()
      lenisSingleton = null
    }
  }, [reduce])
}

/** Smoothly scroll to an element id (falls back to native scroll). */
export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
