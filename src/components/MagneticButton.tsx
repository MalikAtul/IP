import { useRef, type ReactNode, type MouseEvent } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  strength?: number
  as?: 'button' | 'a'
  href?: string
  ariaLabel?: string
  type?: 'button' | 'submit'
}

/**
 * A button (or anchor) that leans toward the pointer while hovered — the
 * classic "magnetic" micro-interaction. Falls back to a static element under
 * prefers-reduced-motion.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 0.4,
  as = 'button',
  href,
  ariaLabel,
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const reduce = useReducedMotion()

  const handleMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
  }

  const common = {
    ref,
    className: `inline-flex items-center justify-center transition-transform duration-200 ease-out will-change-transform ${className}`,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    'data-cursor': 'hover',
    'aria-label': ariaLabel,
  }

  if (as === 'a') {
    return (
      <a {...common} href={href} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <button {...common} type={type} onClick={onClick}>
      {children}
    </button>
  )
}
