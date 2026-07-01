import type { ReactNode } from 'react'
import { GitHubMark, ThreeMark } from './TechIcons'

interface TechPill {
  name: string
  icon: ReactNode
}

const PILLS: TechPill[] = [
  { name: 'Python', icon: <span aria-hidden>🐍</span> },
  { name: 'React', icon: <span aria-hidden>⚛️</span> },
  { name: 'Three.js', icon: <ThreeMark /> },
  { name: 'GitHub', icon: <GitHubMark /> },
]

/**
 * Tech-stack logo pills that slowly orbit the hero 3D centerpiece.
 * The ring spins; each pill counter-spins to stay upright. Tooltip on hover.
 */
export default function HeroOrbit() {
  const radius = 172

  return (
    <div
      aria-hidden="false"
      className="pointer-events-none absolute left-[60%] top-[46%] z-[5] hidden -translate-x-1/2 -translate-y-1/2 md:block"
    >
      <div className="orbit-ring relative h-0 w-0">
        {PILLS.map((pill, i) => {
          const angle = (i / PILLS.length) * 360
          return (
            <div
              key={pill.name}
              className="absolute"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
              }}
            >
              <div className="orbit-pill">
                <div className="group pointer-events-auto relative flex cursor-default items-center gap-1.5 rounded-full border border-divider bg-base/80 px-3 py-1.5 text-xs font-semibold text-text-dark shadow-card backdrop-blur transition-transform hover:scale-110">
                  {pill.icon}
                  <span>{pill.name}</span>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-black px-2 py-1 text-[10px] font-medium text-text-light opacity-0 transition-opacity group-hover:opacity-100">
                    part of the stack
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
