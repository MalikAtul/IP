import { useEffect, useState } from 'react'

/**
 * Observes the given section ids and returns whichever is most in-view.
 * Powers the active-nav highlight.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const visibility = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (best) setActive(best)
      },
      { threshold: [0.15, 0.35, 0.6, 0.85], rootMargin: '-10% 0px -35% 0px' },
    )

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [ids])

  return active
}
