import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  text: string | null
}

/** Comic-style speech bubble that pops above the mascot with a bounce. */
export default function SpeechBubble({ text }: Props) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="relative rounded-2xl border-2 border-ink-black bg-white px-4 py-2 text-sm font-bold text-ink-black shadow-card">
            {text}
            {/* tail */}
            <span className="absolute left-1/2 top-full -translate-x-1/2">
              <span className="block h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-ink-black" />
              <span className="absolute left-1/2 top-0 -mt-[9px] block h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-white" />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
