import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Props {
  to: number
  from?: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

/** Counts up from `from` to `to` the first time it scrolls into view. */
export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  className = '',
  suffix = '',
  prefix = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const [value, setValue] = useState(from)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return

    const run = () => {
      if (started.current) return
      started.current = true
      if (reduce) {
        setValue(to)
        return
      }
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000))
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(from + (to - from) * eased))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    // Start now if already on-screen, otherwise wait until it scrolls in.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh * 0.9 && rect.bottom > 0) {
      run()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, from, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
