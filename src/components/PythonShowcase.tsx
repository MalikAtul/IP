import { Suspense, lazy, useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import problemsData from '../data/problems_advanced.json'
import type { Problem } from '../types'
import ProblemCard from './ProblemCard'
import SplitText from './SplitText'
import CountUp from './CountUp'
import MascotCharacter, { type MascotPose } from './Mascot/MascotCharacter'

// The modal pulls in Monaco — load it only on first card open.
const ProblemModal = lazy(() => import('./ProblemModal'))

const problems = problemsData as Problem[]

export default function PythonShowcase() {
  const [active, setActive] = useState<Problem | null>(null)
  const [mascotPose, setMascotPose] = useState<MascotPose>('sit-type')
  const resetTimer = useRef<number | undefined>(undefined)

  // Mascot celebrates a clean run and facepalms a traceback.
  const onResult = useCallback((ok: boolean) => {
    setMascotPose(ok ? 'celebrate' : 'facepalm')
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setMascotPose('sit-type'), 2400)
  }, [])

  return (
    <section id="projects" className="relative py-28 md:py-40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange">
              Python Showcase
            </p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              <SplitText text="The advanced way." as="span" />
            </h2>
            <p className="mt-6 text-lg text-text-dark/70">
              <CountUp to={problems.length} className="font-bold text-text-dark" /> problems, each
              solved with a sharper Python idiom — dict tricks, unpacking, generators, one-liners.
              Open any card, edit the code, feed it stdin, and{' '}
              <strong>run it live in your browser</strong> (Pyodide — no server).
            </p>
          </div>
          {/* Mascot peeks from the gallery edge, coding along */}
          <div className="hidden shrink-0 self-end lg:block">
            <MascotCharacter pose={mascotPose} size={120} />
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <ProblemCard key={p.id} problem={p} index={i} onOpen={setActive} />
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <AnimatePresence>
          {active && (
            <ProblemModal problem={active} onClose={() => setActive(null)} onResult={onResult} />
          )}
        </AnimatePresence>
      </Suspense>
    </section>
  )
}
