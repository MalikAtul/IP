import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'
import { config } from '../config'
import { useIsMobile, useLowPower } from '../lib/useIsMobile'

type GroupProps = ThreeElements['group']

function Blob(props: GroupProps) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    const { pointer } = state
    // Ease toward the pointer for a reactive, "alive" feel.
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, pointer.x * 0.6, 3, delta)
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, -pointer.y * 0.4, 3, delta)
    // Subtle scroll-linked scale so it "breathes" as the page moves.
    const scrollT = Math.min(1, window.scrollY / (window.innerHeight || 1))
    const target = 1 - scrollT * 0.15
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, target, 4, delta))
    m.rotation.z += delta * 0.05
  })

  return (
    <group {...props}>
      <Icosahedron ref={mesh} args={[1.35, 12]}>
        <MeshDistortMaterial
          color={config.palette.orange}
          emissive={config.palette.orangeHover}
          emissiveIntensity={0.25}
          roughness={0.18}
          metalness={0.35}
          distort={0.4}
          speed={1.6}
        />
      </Icosahedron>
    </group>
  )
}

export default function HeroBlob() {
  const isMobile = useIsMobile()
  const lowPower = useLowPower()
  const dpr = useMemo<[number, number]>(() => (lowPower ? [1, 1.4] : [1, 2]), [lowPower])

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#FFE7D0" />
      <pointLight position={[-4, -2, 2]} intensity={2.2} color={config.palette.orangeLight} />
      <Suspense fallback={null}>
        <Float
          speed={isMobile ? 1 : 1.6}
          rotationIntensity={isMobile ? 0.3 : 0.7}
          floatIntensity={isMobile ? 0.6 : 1.1}
        >
          <Blob />
        </Float>
        {!lowPower && <Environment preset="sunset" />}
      </Suspense>
    </Canvas>
  )
}
