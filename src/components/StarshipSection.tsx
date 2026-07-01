import { Suspense, lazy } from 'react'
import DeckEmbed from './DeckEmbed'
import SplitText from './SplitText'

// The full R3F explorer is heavy — lazy-load it.
const StarshipExplorer = lazy(() => import('../scenes/StarshipExplorer'))

export default function StarshipSection() {
  return (
    <section id="deep-dive" className="relative">
      {/* Section intro on a bright band before the dark explorer */}
      <div className="container-page py-20 md:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange">
          Deep Dive
        </p>
        <h2 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          <SplitText text="SpaceX Starship — taken apart, part by part." as="span" />
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-text-dark/70">
          A procedural 3D model built entirely from Three.js primitives — no downloaded assets.
          Orbit it, then hit <strong>Explode</strong> to pull every subsystem apart and read the
          software story behind each one.
        </p>
      </div>

      {/* 4a — interactive explorer */}
      <Suspense
        fallback={
          <div className="grid h-[60vh] place-items-center bg-ink-charcoal text-text-light/60">
            Loading the Starship explorer…
          </div>
        }
      >
        <StarshipExplorer />
      </Suspense>

      {/* 4b — slide deck */}
      <DeckEmbed />
    </section>
  )
}
