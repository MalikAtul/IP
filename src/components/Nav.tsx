import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { config } from '../config'
import { scrollToId } from '../lib/useSmoothScroll'
import { useActiveSection } from '../lib/useActiveSection'

const SECTION_IDS = config.nav.map((n) => n.id)

export default function Nav() {
  const active = useActiveSection(SECTION_IDS)
  const [open, setOpen] = useState(false)

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav className="container-page mt-4">
        <div className="glass flex items-center justify-between rounded-full border border-divider px-5 py-3 shadow-sm">
          <button
            onClick={() => go('home')}
            data-cursor="hover"
            className="flex items-center gap-2 text-sm font-extrabold tracking-tight"
            aria-label="Go to top"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-grad text-white">
              A
            </span>
            <span className="hidden sm:inline">{config.name}</span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {config.nav.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  data-cursor="hover"
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active === item.id ? 'text-orange' : 'text-text-dark/70 hover:text-text-dark'
                  }`}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-orange/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <a
            href={config.contact.email}
            data-cursor="hover"
            className="hidden rounded-full bg-ink-black px-4 py-2 text-sm font-semibold text-text-light transition-colors hover:bg-ink-charcoal md:inline-flex"
          >
            Let’s talk
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            data-cursor="hover"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-divider md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-text-dark transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span className={`block h-0.5 w-5 bg-text-dark transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span
                className={`block h-0.5 w-5 bg-text-dark transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="glass mt-2 overflow-hidden rounded-2xl border border-divider md:hidden"
            >
              {config.nav.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.id)}
                    className={`block w-full px-6 py-3 text-left text-sm font-medium ${
                      active === item.id ? 'text-orange' : 'text-text-dark/80'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
