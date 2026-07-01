import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { config } from '../config'
import SplitText from './SplitText'
import MagneticButton from './MagneticButton'
import { scrollToId } from '../lib/useSmoothScroll'

// The 3D blob is heavy — load it lazily so first paint stays fast.
const HeroBlob = lazy(() => import('../scenes/HeroBlob'))

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Reactive 3D centerpiece */}
      <div className="absolute inset-0 -z-0">
        <Suspense fallback={<div className="h-full w-full" />}>
          <HeroBlob />
        </Suspense>
      </div>

      {/* Soft warm glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-orange-light/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />

      <div className="container-page relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-divider bg-base/70 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange" />
          Building toward autonomous defense systems
        </motion.p>

        <h1 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
          <SplitText as="span" text={config.heroName} className="block" delay={0.4} />
          <span className="mt-2 block text-2xl font-semibold text-muted md:text-4xl">
            <SplitText text={config.heroTagline} delay={0.7} stagger={0.03} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-8 max-w-xl text-lg text-text-dark/70"
        >
          A student building gadgets after school while trying to make the world a little safer —
          rendered as an immersive, scroll-driven experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            onClick={() => scrollToId('projects')}
            className="rounded-full bg-orange px-7 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-orange-hover"
          >
            Explore the work
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollToId('deep-dive')}
            className="rounded-full border border-ink-black/20 px-7 py-3.5 text-sm font-bold text-text-dark hover:border-ink-black"
          >
            Deep Dive: Starship ↓
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => scrollToId('about')}
        aria-label="Scroll down"
        data-cursor="hover"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-text-dark/30 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-orange"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
      </motion.button>
    </section>
  )
}
