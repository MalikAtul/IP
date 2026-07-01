import { AnimatePresence, motion } from 'framer-motion'
import { PARTS, type PartKey } from '../scenes/starshipParts'

interface Props {
  selected: PartKey | null
  onClose: () => void
}

/** Slide-in info panel (right edge) with the deep software/systems story. */
export default function StarshipSidePanel({ selected, onClose }: Props) {
  const info = selected ? PARTS[selected] : null

  return (
    <AnimatePresence>
      {info && (
        <motion.aside
          key={info.key}
          role="dialog"
          aria-label={`${info.name} details`}
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="absolute right-3 top-3 bottom-3 z-30 flex w-[340px] max-w-[85vw] flex-col rounded-2xl border border-white/10 bg-ink-charcoal p-6 shadow-2xl md:w-[380px]"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-extrabold leading-tight text-orange">{info.name}</h3>
            <button
              onClick={onClose}
              data-cursor="hover"
              aria-label="Close panel"
              className="shrink-0 rounded-full border border-white/15 px-2 py-1 text-sm text-text-light/70 transition-colors hover:border-orange hover:text-orange"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 h-px w-full bg-gradient-to-r from-orange/70 to-transparent" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-text-light/50">
            Software &amp; systems
          </p>
          <p className="mt-2 overflow-y-auto text-sm leading-relaxed text-text-light/85 no-scrollbar">
            {info.panel}
          </p>
          <div className="mt-auto pt-4 text-xs text-text-light/40">
            Starship · procedural R3F model · illustrative facts
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
