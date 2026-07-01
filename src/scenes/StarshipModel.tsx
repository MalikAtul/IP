import { useEffect, useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { config } from '../config'
import { PARTS, type PartKey } from './starshipParts'

const STEEL = config.palette.steel
const ORANGE = config.palette.orange

interface ModelProps {
  exploded: boolean
  hovered: PartKey | null
  setHovered: (k: PartKey | null) => void
  onSelect: (k: PartKey) => void
  reducedMotion: boolean
}

/** Brushed-steel material with an orange emissive glow on hover. */
function Steel({ glow, color = STEEL }: { glow: boolean; color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.7}
      roughness={0.3}
      emissive={ORANGE}
      emissiveIntensity={glow ? 0.55 : 0}
    />
  )
}

function ring(radius: number, count: number): Array<[number, number, number]> {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    return [Math.cos(a) * radius, 0, Math.sin(a) * radius]
  })
}

function Nozzle({ scale = 1 }: { scale?: number }) {
  return (
    <mesh castShadow scale={scale}>
      <cylinderGeometry args={[0.11, 0.19, 0.5, 16]} />
      <meshStandardMaterial color="#2A2A2E" metalness={0.85} roughness={0.35} />
    </mesh>
  )
}

export default function StarshipModel({
  exploded,
  hovered,
  setHovered,
  onSelect,
  reducedMotion,
}: ModelProps) {
  const refs = {
    ship: useRef<THREE.Group>(null),
    booster: useRef<THREE.Group>(null),
    raptorsInner: useRef<THREE.Group>(null),
    raptorsOuter: useRef<THREE.Group>(null),
    gridFins: useRef<THREE.Group>(null),
    bodyFlaps: useRef<THREE.Group>(null),
    chopsticks: useRef<THREE.Group>(null),
  }

  // GSAP explode / reassemble timeline.
  useEffect(() => {
    ;(Object.keys(PARTS) as PartKey[]).forEach((key) => {
      const g = refs[key].current
      if (!g) return
      const info = PARTS[key]
      const [px, py, pz] = exploded ? info.explodePosition : [0, 0, 0]
      const [sx, sy, sz] = exploded ? info.explodeScale : [1, 1, 1]
      const duration = reducedMotion ? 0.001 : 0.8
      const delay = reducedMotion ? 0 : info.order * 0.1
      gsap.to(g.position, { x: px, y: py, z: pz, duration, delay, ease: 'power3.out' })
      gsap.to(g.scale, { x: sx, y: sy, z: sz, duration, delay, ease: 'power3.out' })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exploded, reducedMotion])

  const innerNozzles = useMemo(() => [...ring(0.25, 3), ...ring(0.6, 10)], [])
  const outerNozzles = useMemo(() => ring(0.95, 20), [])
  const gridFinAngles = useMemo(() => [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2), [])
  const flapAngles = useMemo(() => [0.6, Math.PI - 0.6, Math.PI + 0.6, -0.6], [])

  // Shared handlers that also drive the grab cursor.
  const hoverProps = (key: PartKey) => ({
    onPointerOver: (e: THREE.Event) => {
      ;(e as unknown as { stopPropagation: () => void }).stopPropagation()
      setHovered(key)
    },
    onPointerOut: () => setHovered(null),
    onClick: (e: THREE.Event) => {
      ;(e as unknown as { stopPropagation: () => void }).stopPropagation()
      onSelect(key)
    },
  })

  const Label = ({ k }: { k: PartKey }) => {
    if (!exploded) return null
    const info = PARTS[k]
    return (
      <Html
        position={info.labelAnchor}
        center
        distanceFactor={12}
        occlude={false}
        zIndexRange={[40, 0]}
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={() => onSelect(k)}
          data-cursor="hover"
          className="w-52 cursor-pointer rounded-lg border border-orange/60 bg-ink-black/90 px-3 py-2 text-left shadow-glow backdrop-blur-sm transition-transform hover:scale-[1.03]"
        >
          <span className="block text-[11px] font-bold uppercase tracking-wider text-orange">
            {info.name}
          </span>
          <span className="mt-1 block text-[10px] leading-snug text-text-light/85">
            {info.fact}
          </span>
        </button>
      </Html>
    )
  }

  return (
    <group position={[0, -0.5, 0]}>
      {/* ---- Super Heavy Booster ---- */}
      <group ref={refs.booster} {...hoverProps('booster')}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.95, 1.08, 8, 40]} />
          <Steel glow={hovered === 'booster'} />
        </mesh>
        {/* interstage ring accent */}
        <mesh position={[0, 4.05, 0]}>
          <cylinderGeometry args={[0.97, 0.97, 0.25, 40]} />
          <Steel glow={hovered === 'booster'} color={ORANGE} />
        </mesh>
        <Label k="booster" />
      </group>

      {/* ---- Inner Raptors (3 + 10) ---- */}
      <group ref={refs.raptorsInner} position={[0, 0, 0]} {...hoverProps('raptorsInner')}>
        <group position={[0, -4.15, 0]}>
          {innerNozzles.map((p, i) => (
            <group key={`ri-${i}`} position={p}>
              <Nozzle />
            </group>
          ))}
        </group>
        <Label k="raptorsInner" />
      </group>

      {/* ---- Outer Raptors (20) ---- */}
      <group ref={refs.raptorsOuter} position={[0, 0, 0]} {...hoverProps('raptorsOuter')}>
        <group position={[0, -4.15, 0]}>
          {outerNozzles.map((p, i) => (
            <group key={`ro-${i}`} position={p}>
              <Nozzle scale={0.9} />
            </group>
          ))}
        </group>
        <Label k="raptorsOuter" />
      </group>

      {/* ---- Grid Fins (4) ---- */}
      <group ref={refs.gridFins} position={[0, 0, 0]} {...hoverProps('gridFins')}>
        {gridFinAngles.map((a, i) => (
          <group key={`gf-${i}`} position={[Math.cos(a) * 1.05, 3.2, Math.sin(a) * 1.05]} rotation={[0, -a, 0]}>
            <mesh>
              <boxGeometry args={[0.5, 0.7, 0.08]} />
              <Steel glow={hovered === 'gridFins'} />
            </mesh>
          </group>
        ))}
        <Label k="gridFins" />
      </group>

      {/* ---- Ship (upper stage) + nose + 6 engines ---- */}
      <group ref={refs.ship} position={[0, 0, 0]} {...hoverProps('ship')}>
        <mesh position={[0, 5.9, 0]}>
          <cylinderGeometry args={[0.8, 0.82, 3, 40]} />
          <Steel glow={hovered === 'ship'} />
        </mesh>
        {/* nose cone */}
        <mesh position={[0, 8.2, 0]}>
          <coneGeometry args={[0.8, 1.6, 40]} />
          <Steel glow={hovered === 'ship'} />
        </mesh>
        {/* docking-port accent ring near the nose */}
        <mesh position={[0, 7.3, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.15, 40]} />
          <Steel glow={hovered === 'ship'} color={ORANGE} />
        </mesh>
        {/* 3 sea-level + 3 vacuum engines at the ship base */}
        <group position={[0, 4.3, 0]}>
          {ring(0.22, 3).map((p, i) => (
            <group key={`sl-${i}`} position={p}>
              <Nozzle scale={0.7} />
            </group>
          ))}
          {ring(0.5, 3).map((p, i) => (
            <group key={`vac-${i}`} position={[p[0], p[1], p[2]]} rotation={[0, Math.PI / 3, 0]}>
              <Nozzle scale={1.05} />
            </group>
          ))}
        </group>
        <Label k="ship" />
      </group>

      {/* ---- Body Flaps (4) ---- */}
      <group ref={refs.bodyFlaps} position={[0, 0, 0]} {...hoverProps('bodyFlaps')}>
        {flapAngles.map((a, i) => (
          <group key={`bf-${i}`} position={[Math.cos(a) * 0.82, i < 2 ? 6.8 : 4.6, Math.sin(a) * 0.82]} rotation={[0, -a, 0]}>
            <mesh>
              <boxGeometry args={[0.12, 1.0, 0.6]} />
              <Steel glow={hovered === 'bodyFlaps'} />
            </mesh>
          </group>
        ))}
        <Label k="bodyFlaps" />
      </group>

      {/* ---- Mechazilla tower (static) ---- */}
      <group position={[-3.6, 0, 0]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.55, 13, 0.55]} />
          <meshStandardMaterial color={config.palette.raised} metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, 7.8, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color={config.palette.raised} metalness={0.5} roughness={0.6} />
        </mesh>
      </group>

      {/* ---- Chopstick arms (explodable) ---- */}
      <group ref={refs.chopsticks} position={[0, 0, 0]} {...hoverProps('chopsticks')}>
        {[2.0, 2.7].map((y, i) => (
          <mesh key={`arm-${i}`} position={[-2.05, y, i === 0 ? 0.35 : -0.35]}>
            <boxGeometry args={[3.0, 0.22, 0.28]} />
            <meshStandardMaterial
              color={config.palette.raised}
              metalness={0.5}
              roughness={0.55}
              emissive={ORANGE}
              emissiveIntensity={hovered === 'chopsticks' ? 0.5 : 0}
            />
          </mesh>
        ))}
        <Label k="chopsticks" />
      </group>
    </group>
  )
}
