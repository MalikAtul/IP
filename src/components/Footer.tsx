import { Suspense, lazy } from 'react'
import { config } from '../config'
import MagneticButton from './MagneticButton'
import SplitText from './SplitText'
import { scrollToId } from '../lib/useSmoothScroll'

const ParticleField = lazy(() => import('../scenes/ParticleField'))

const LINKS: Array<{ label: string; href: string }> = [
  { label: 'Email', href: config.contact.email },
  { label: 'GitHub', href: config.contact.github },
  { label: 'LinkedIn', href: config.contact.linkedin },
  { label: 'X', href: config.contact.x },
  { label: 'Instagram', href: config.contact.instagram },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-ink-black text-text-light">
      {/* 3D particle flourish */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </div>

      <div className="container-page relative z-10 py-24 md:py-32">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-light">
          Contact
        </p>
        <h2 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
          <SplitText text="Let's build something that matters." as="span" />
        </h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {LINKS.map((l) => (
            <MagneticButton
              key={l.label}
              as="a"
              href={l.href}
              ariaLabel={l.label}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-text-light/90 transition-colors hover:border-orange hover:text-orange"
            >
              {l.label} ↗
            </MagneticButton>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="text-sm text-text-light/50">
            © {new Date().getFullYear()} {config.name}. Built in India — DRISHTI · TechnoXian · and
            what comes next.
          </p>
          <MagneticButton
            onClick={() => scrollToId('home')}
            className="rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-light hover:bg-white/10"
          >
            Back to top ↑
          </MagneticButton>
        </div>

        <p className="mt-8 text-xs text-text-light/30">
          Crafted with React, Three.js, GSAP &amp; Pyodide. Every section reacts to scroll and
          pointer.
        </p>
      </div>
    </footer>
  )
}
