import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import SplitText from './SplitText'

interface Project {
  name: string
  body: React.ReactNode
}

const PROJECTS: Project[] = [
  {
    name: 'Project DRISHTI',
    body: (
      <>
        AI-powered assistive technology for deaf, mute, and blind users: smart Indian Sign Language
        (ISL) gloves paired with the <strong>KAI</strong> wearable locket. Hindi-first,
        offline-capable, India-made. Selected at block and school level for the{' '}
        <strong>MANAK / INSPIRE Awards 2025</strong>.
      </>
    ),
  },
  {
    name: 'TechnoXian World Robotics Championship',
    body: (
      <>
        competing in <strong>Fastest Line Follower, Water Rocket, and Maze Solver</strong>. Currently
        in deep-prep phase.
      </>
    ),
  },
  {
    name: 'Two more projects',
    body: <>in development — kept under wraps for now.</>,
  },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const parallax = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80])

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-28 md:py-40">
      {/* Parallax numeral */}
      <motion.span
        style={{ y: parallax }}
        aria-hidden
        className="pointer-events-none absolute -right-6 top-10 select-none text-[28vw] font-black leading-none text-ink-black/[0.04] md:text-[20vw]"
      >
        02
      </motion.span>

      <div className="container-page">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange">
          About / Creator
        </p>
        <h2 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          <SplitText
            text="Atul — Class XI student, builder, aspiring defense-tech engineer."
            as="span"
          />
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

        {/* Current projects */}
        <div className="mt-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
            Current projects
          </h3>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                data-cursor="hover"
                className="group relative rounded-2xl border border-divider bg-white/60 p-6 shadow-card transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-glow"
              >
                <div className="mb-3 h-1 w-10 rounded-full bg-orange-grad transition-all duration-300 group-hover:w-16" />
                <p className="text-lg font-bold text-text-dark">{p.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{p.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Building toward — heavy dark accent block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.7 }}
          className="mt-14 rounded-3xl bg-ink-black p-8 text-text-light md:p-12"
        >
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-light">
            Building toward
          </h3>
          <p className="mt-4 max-w-3xl text-2xl font-semibold leading-snug md:text-3xl">
            autonomous defense systems — interceptor drones, swarm intelligence, and counter-swarm
            technology — built in India, for India. DRISHTI and TechnoXian are the foundation years.
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-16 max-w-3xl text-center text-xl italic text-text-dark/70 md:text-2xl"
        >
          “I've been compared to Peter Parker — a student building gadgets after school while trying
          to make the world a little safer. I'll take it.”
        </motion.blockquote>
      </div>
    </section>
  )
}
