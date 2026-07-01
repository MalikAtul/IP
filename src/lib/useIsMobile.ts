import { useEffect, useState } from 'react'

/**
 * Returns true when the viewport is below `breakpoint` (px) or the device is
 * coarse-pointer / low-core — a signal to swap heavy 3D for a lighter version.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobile
}

/** Coarse heuristic for weak GPUs — used to further reduce 3D cost. */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8
    const coarse = window.matchMedia('(pointer: coarse)').matches
    setLow(cores <= 4 || coarse)
  }, [])
  return low
}
