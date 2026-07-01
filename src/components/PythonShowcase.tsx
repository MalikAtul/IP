import { Suspense, lazy, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import problemsData from '../data/problems_advanced.json'
import type { Problem } from '../types'
import ProblemCard from './ProblemCard'
import SplitText from './SplitText'

// The modal pulls in Monaco — load it only on first card open.
const ProblemModal = lazy(() => import('./ProblemModal'))

const problems = problemsData as Problem[]

export default function PythonShowcase() {
  const [active, setActive] = useState<Problem | null>(null)

  return (
    <section id="projects" className="relative py-28 md:py-40">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange">
            Python Showcase
          </p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            <SplitText text="The advanced way." as="span" />
          </h2>
          <p className="mt-6 text-lg text-text-dark/70">
            {problems.length} problems, each solved with a sharper Python idiom — dict tricks,
            unpacking, generators, one-liners. Open any card, edit the code, feed it stdin, and{' '}
            <strong>run it live in your browser</strong> (Pyodide — no server).
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <ProblemCard key={p.id} problem={p} index={i} onOpen={setActive} />
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <AnimatePresence>
          {active && <ProblemModal problem={active} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </Suspense>
    </section>
  )
}
