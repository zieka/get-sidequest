import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?: number;
}

export function Particles({ count = 60 }: Props) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;     // x
      pos[i * 3 + 1] = Math.random() * 5 + 0.5;     // y (above ground)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;  // z
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Gentle floating drift
      posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
      posArray[i * 3] += Math.sin(state.clock.elapsedTime * 0.2 + i * 0.5) * 0.001;
      // Reset if too high
      if (posArray[i * 3 + 1] > 6) posArray[i * 3 + 1] = 0.5;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffe8a0"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
