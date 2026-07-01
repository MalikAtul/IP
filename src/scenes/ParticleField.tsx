import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { config } from '../config'
import { useLowPower } from '../lib/useIsMobile'

function Points({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    const p = ref.current
    if (!p) return
    p.rotation.y += delta * 0.04
    p.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color={config.palette.orangeLight}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleField() {
  const lowPower = useLowPower()
  const count = lowPower ? 300 : 900

  return (
    <Canvas
      dpr={lowPower ? [1, 1.3] : [1, 2]}
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ alpha: true, antialias: false }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Points count={count} />
      </Suspense>
    </Canvas>
  )
}
