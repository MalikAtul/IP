import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import StarshipModel from './StarshipModel'
import StarshipSidePanel from '../components/StarshipSidePanel'
import { config } from '../config'
import { useLowPower } from '../lib/useIsMobile'
import type { PartKey } from './starshipParts'

export default function StarshipExplorer() {
  const [exploded, setExploded] = useState(false)
  const [hovered, setHovered] = useState<PartKey | null>(null)
  const [selected, setSelected] = useState<PartKey | null>(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const reduce = useReducedMotion() ?? false
  const lowPower = useLowPower()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const idleTimer = useRef<number | undefined>(undefined)

  // Auto-rotate after 5s of no interaction; stop on any touch.
  const bumpIdle = useCallback(() => {
    setAutoRotate(false)
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setAutoRotate(true), 5000)
  }, [])

  useEffect(() => {
    bumpIdle()
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [bumpIdle])

  return (
    <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink-charcoal">
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={bumpIdle}
        onWheel={bumpIdle}
      >
        <Canvas
          dpr={lowPower ? [1, 1.4] : [1, 2]}
          camera={{ position: [7, 3, 10], fov: 42 }}
          gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[config.palette.charcoal]} />
          <fog attach="fog" args={[config.palette.charcoal, 18, 42]} />
          <ambientLight intensity={0.5} />
          <hemisphereLight args={['#cfd6de', '#1a1a1e', 0.5]} />
          <directionalLight position={[6, 12, 8]} intensity={1.3} color="#FFFFFF" />
          <pointLight position={[-6, 2, 4]} intensity={40} color={config.palette.orange} distance={30} />
          <pointLight position={[6, -4, -4]} intensity={20} color={config.palette.orangeLight} distance={30} />

          <Suspense fallback={null}>
            <StarshipModel
              exploded={exploded}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={setSelected}
              reducedMotion={reduce}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
            minDistance={7}
            maxDistance={20}
            autoRotate={autoRotate && !reduce}
            autoRotateSpeed={0.6}
            onStart={bumpIdle}
          />
        </Canvas>
      </div>

      {/* Explode / Reset control */}
      <button
        onClick={() => {
          setExploded((e) => !e)
          if (exploded) setSelected(null)
        }}
        data-cursor="hover"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-orange px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-colors hover:bg-orange-hover"
      >
        {exploded ? 'Reset ↺' : 'Explode ▶'}
      </button>

      {/* Hint */}
      <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs text-xs text-text-light/60">
        <p className="font-semibold text-text-light/80">Starship — interactive explorer</p>
        <p className="mt-1">Drag to orbit · click a part for its software story.</p>
      </div>

      <StarshipSidePanel selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
