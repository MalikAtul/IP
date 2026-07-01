import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import type { Problem } from '../types'
import CodePanel from './CodePanel'
import { getLenis } from '../lib/useSmoothScroll'

interface Props {
  problem: Problem
  onClose: () => void
  onResult?: (ok: boolean) => void
}

export default function ProblemModal({ problem, onClose, onResult }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Lock background scroll + focus management while open.
  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      document.body.style.overflow = ''
      prevFocus?.focus()
    }
  }, [onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 my-4 w-full max-w-3xl overflow-hidden rounded-3xl bg-ink-charcoal text-text-light shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6 md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-light/40">
                #{String(problem.id).padStart(2, '0')}
              </span>
              <span className="inline-flex items-center rounded-full border border-orange/60 px-3 py-1 text-xs font-medium text-orange">
                {problem.technique}
              </span>
            </div>
            <h3 id="problem-title" className="mt-3 text-2xl font-extrabold md:text-3xl">
              {problem.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-light/70">
              {problem.question}
            </p>
          </div>
          <button
            onClick={onClose}
            data-cursor="hover"
            aria-label="Close"
            className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-text-light/70 transition-colors hover:border-orange hover:text-orange"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <CodePanel problem={problem} onResult={onResult} />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
