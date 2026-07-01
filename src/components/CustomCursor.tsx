import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * A two-part custom cursor: a small solid dot that tracks instantly and a
 * larger ring that eases behind it. Grows over interactive elements.
 * Rendered only on fine-pointer devices.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    document.body.classList.add('custom-cursor')

    const dot = dotRef.current!
    const ring = ringRef.current!
    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor="hover"], input, textarea')
      ring.dataset.hover = interactive ? 'true' : 'false'
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    const onDown = () => (ring.dataset.down = 'true')
    const onUp = () => (ring.dataset.down = 'false')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={dotRef}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-orange"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        data-hover="false"
        data-down="false"
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-orange/70 transition-[width,height,background-color,opacity] duration-200 ease-out data-[hover=true]:h-12 data-[hover=true]:w-12 data-[hover=true]:-ml-6 data-[hover=true]:-mt-6 data-[hover=true]:bg-orange/10 data-[down=true]:scale-90"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
