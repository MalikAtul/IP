import { Suspense, lazy } from 'react'
import DeckEmbed from './DeckEmbed'
import SplitText from './SplitText'
import CountUp from './CountUp'

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

        {/* Count-up stats */}
        <div className="mt-10 flex flex-wrap gap-8">
          {[
            { n: 33, label: 'Raptor engines' },
            { n: 121, label: 'metres, stacked' },
            { n: 2024, label: 'first tower catch' },
          ].map((s) => (
            <div key={s.label}>
              <CountUp to={s.n} className="text-4xl font-black text-orange md:text-5xl" />
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          ))}
        </div>
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
