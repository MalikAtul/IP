import { useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import SplitText from './SplitText'
import CountUp from './CountUp'
import MascotCharacter, { type MascotPose } from './Mascot/MascotCharacter'
import { GitHubMark, ThreeMark, CppMark, ArduinoMark } from './TechIcons'

const NAVY = '#0B1E3B'

interface ExpandableProps {
  index: string
  title: string
  teaser: string
  defaultOpen?: boolean
  children: ReactNode
}

function ExpandableCard({ index, title, teaser, defaultOpen = false, children }: ExpandableProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden rounded-2xl border border-divider bg-white/70 shadow-card"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-6 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-grad font-mono text-xs font-bold text-white">
          {index}
        </span>
        <span className="flex-1">
          <span className="block text-lg font-bold text-text-dark">{title}</span>
          <span className="mt-0.5 block text-sm text-muted">{teaser}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-divider text-text-dark/60"
          aria-hidden
        >
          ⌄
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-divider px-6 pb-6 pt-4 text-sm leading-relaxed text-text-dark/80">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const TECH: Array<{ name: string; icon: ReactNode }> = [
  { name: 'Python', icon: <span aria-hidden>🐍</span> },
  { name: 'React', icon: <span aria-hidden>⚛️</span> },
  { name: 'Three.js', icon: <ThreeMark /> },
  { name: 'C++', icon: <CppMark /> },
  { name: 'Arduino', icon: <ArduinoMark /> },
  { name: 'GitHub', icon: <GitHubMark /> },
  { name: 'Raspberry Pi', icon: <span aria-hidden>🍓</span> },
  { name: 'TensorFlow / AI', icon: <span aria-hidden>🧠</span> },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const defenseRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const reduce = useReducedMotion()

  const defenseInView = useInView(defenseRef, { margin: '-40% 0px -40% 0px' })
  const quoteInView = useInView(quoteRef, { margin: '-45% 0px -45% 0px' })
  const mascotPose: MascotPose = quoteInView ? 'thumbs-up' : defenseInView ? 'superhero-landing' : 'explain'

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80])
  const buildingY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60])

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-28 md:py-40">
      <motion.span
        style={{ y: parallax }}
        aria-hidden
        className="pointer-events-none absolute -right-6 top-10 select-none text-[28vw] font-black leading-none text-ink-black/[0.04] md:text-[20vw]"
      >
        02
      </motion.span>

      <div className="container-page relative">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange">About / Creator</p>
        <h2 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          <SplitText text="Atul — Class XI student, builder, aspiring defense-tech engineer." as="span" />
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7 }}
          className="mt-6 max-w-2xl text-xl font-medium text-text-dark/80"
        >
          I build things that are meant to matter.
        </motion.p>

        {/* Stats strip with count-up */}
        <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
          {[
            { n: 2025, label: 'MANAK / INSPIRE' },
            { n: 3, label: 'TechnoXian events' },
            { n: 2, label: 'Under wraps' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-divider bg-white/60 p-4">
              <CountUp to={s.n} className="text-3xl font-black text-orange" />
              <p className="mt-1 text-xs font-medium text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Current projects — expandable */}
        <div className="mt-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Current projects</h3>
          <div className="mt-6 grid gap-4">
            <ExpandableCard
              index="01"
              title="Project DRISHTI"
              teaser="Assistive tech for deaf, mute & blind users — ISL gloves + KAI locket"
              defaultOpen
            >
              <p>
                AI-powered assistive technology for deaf, mute, and blind users. Smart ISL (Indian
                Sign Language) gloves paired with the <strong>KAI</strong> wearable locket.
                Hindi-first, offline-capable, India-made. Selected at{' '}
                <strong>block and school level — MANAK / INSPIRE Awards 2025</strong>.
              </p>
              {/* Classified stamp badge */}
              <motion.div
                animate={reduce ? {} : { boxShadow: ['0 0 0 0 rgba(255,107,26,0)', '0 0 0 6px rgba(255,107,26,0.12)', '0 0 0 0 rgba(255,107,26,0)'] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="mt-4 inline-flex items-center gap-2 rounded-md border-2 px-3 py-2 text-xs font-extrabold uppercase tracking-wide"
                style={{ borderColor: '#FF6B1A', background: NAVY, color: '#F5F2EC' }}
              >
                <span className="text-base">🛡️</span>
                <span>
                  Classified under: Ministry of Defence, Government of India —{' '}
                  <span className="text-orange-light">Dual-Use Innovation</span>
                </span>
              </motion.div>
            </ExpandableCard>

            <ExpandableCard
              index="02"
              title="TechnoXian World Robotics Championship"
              teaser="Fastest Line Follower · Water Rocket · Maze Solver"
            >
              <p>
                Competing in <strong>Fastest Line Follower · Water Rocket · Maze Solver</strong>.
                Currently in deep-prep phase.
              </p>
            </ExpandableCard>

            <ExpandableCard
              index="03"
              title="Confidential Projects ×2 🔒"
              teaser="Two more projects in development"
            >
              <p>Two more projects in development — kept under wraps for now. 🔒</p>
            </ExpandableCard>
          </div>
        </div>

        {/* Standalone Ministry of Defence block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex items-center gap-5 rounded-r-2xl border-l-4 border-orange p-8 md:p-10"
          style={{ background: `linear-gradient(100deg, ${NAVY} 0%, #14141A 100%)` }}
        >
          <span className="text-4xl md:text-5xl" aria-hidden>
            🛡️
          </span>
          <p className="text-lg font-bold leading-snug text-white md:text-2xl">
            Currently working in affiliation with the{' '}
            <span className="text-orange-light">Ministry of Defence, Government of India.</span>
          </p>
        </motion.div>

        {/* Tech stack chips */}
        <div className="mt-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Tech I build with</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {TECH.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                data-cursor="hover"
                className="group flex items-center gap-2 rounded-full border border-divider bg-white/70 px-4 py-2 text-sm font-semibold text-text-dark shadow-sm transition-all hover:border-orange hover:shadow-glow"
              >
                <span className="text-text-dark transition-colors group-hover:text-orange">{t.icon}</span>
                {t.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Building toward — cinematic full-bleed parallax */}
        <div ref={defenseRef} className="mt-24 rounded-3xl bg-ink-black p-8 text-text-light md:p-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-light">Building toward</h3>
          <motion.p style={{ y: buildingY }} className="mt-5 max-w-4xl text-2xl font-black leading-tight md:text-5xl">
            Autonomous defense systems — interceptor drones, swarm intelligence, counter-swarm
            technology — <span className="text-gradient">built in India, for India.</span>
          </motion.p>
        </div>

        <motion.blockquote
          ref={quoteRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-16 max-w-3xl text-center text-xl italic text-text-dark/70 md:text-2xl"
        >
          Compared to Peter Parker by some. A student building gadgets after school while trying to
          make the world a little safer. I'll take it.
        </motion.blockquote>

        {/* Sticky mascot guide — reacts to the block in view */}
        <div className="sticky bottom-6 z-10 mt-8 hidden w-fit lg:block">
          <MascotCharacter pose={mascotPose} size={116} />
        </div>
      </div>
    </section>
  )
}
