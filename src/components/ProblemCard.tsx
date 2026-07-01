import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import type { Problem } from '../types'

interface Props {
  problem: Problem
  index: number
  onOpen: (p: Problem) => void
}

export default function ProblemCard({ problem, index, onOpen }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 })
  const glowX = useTransform(px, (v) => `${v * 100}%`)
  const glowY = useTransform(py, (v) => `${v * 100}%`)
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: string[]) =>
      `radial-gradient(300px circle at ${x} ${y}, rgba(255,107,26,0.16), transparent 60%)`,
  )

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const firstLine = problem.code.split('\n')[0]

  return (
    <motion.button
      ref={ref}
      onClick={() => onOpen(problem)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex h-full min-h-[190px] w-full flex-col overflow-hidden rounded-2xl border border-divider bg-white/70 p-6 text-left shadow-card transition-shadow duration-300 hover:shadow-glow"
    >
      {/* Pointer-follow glow */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBg }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">
          #{String(problem.id).padStart(2, '0')}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-black/[0.04] text-text-dark/50 transition-all duration-300 group-hover:bg-orange group-hover:text-white">
          →
        </span>
      </div>

      <h3 className="relative z-10 mt-4 text-lg font-bold leading-snug text-text-dark">
        {problem.title}
      </h3>

      <p className="relative z-10 mt-auto pt-4 font-mono text-xs text-muted line-clamp-1">
        {firstLine}
      </p>

      <span className="relative z-10 mt-3 inline-flex w-fit items-center rounded-full border border-orange/40 px-2.5 py-0.5 text-[10px] font-medium text-orange">
        {problem.technique.split(',')[0]}
      </span>
    </motion.button>
  )
}
