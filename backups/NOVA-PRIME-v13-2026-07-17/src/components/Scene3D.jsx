import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Particle Field (optimisé : moins de particules, pas de mouse) ───
function ParticleField({ count = 200 }) {
  const mesh = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const emeraldColor = new THREE.Color('#00D4AA')
    const goldColor = new THREE.Color('#F59E0B')
    const royalColor = new THREE.Color('#2A5CAA')
    const palette = [emeraldColor, goldColor, royalColor]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25
      const c = palette[Math.floor(Math.random() * palette.length)]
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }
    return [pos, cols]
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.elapsedTime
    const posArray = mesh.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArray[i3] += Math.sin(time * 0.1 + i * 0.01) * 0.002
      posArray[i3 + 1] += Math.cos(time * 0.15 + i * 0.01) * 0.002
      posArray[i3 + 2] += Math.sin(time * 0.08 + i * 0.02) * 0.001
      if (posArray[i3] > 12.5) posArray[i3] = -12.5
      if (posArray[i3] < -12.5) posArray[i3] = 12.5
      if (posArray[i3 + 1] > 12.5) posArray[i3 + 1] = -12.5
      if (posArray[i3 + 1] < -12.5) posArray[i3 + 1] = 12.5
      if (posArray[i3 + 2] > 12.5) posArray[i3 + 2] = -12.5
      if (posArray[i3 + 2] < -12.5) posArray[i3 + 2] = 12.5
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// ─── Main Component (Desktop Only — wrapper already filters by screen size) ───
export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ParticleField count={200} />
      </Canvas>
    </div>
  )
}
