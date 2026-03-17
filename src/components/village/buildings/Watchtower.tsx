import { useMemo } from 'react';
import * as THREE from 'three';
import { createPixelTexture } from './textureUtils';

export function Watchtower() {
  const stoneTexture = useMemo(
    () => createPixelTexture(16, '#6b6b6b', ['#7a7a7a', '#5e5e5e', '#737373']),
    []
  );

  const woodTexture = useMemo(
    () => createPixelTexture(16, '#8B6914', ['#7a5c12', '#9b7924']),
    []
  );

  const roofTexture = useMemo(
    () => createPixelTexture(16, '#3a4a5a', ['#4a5a6a', '#2f3f4f']),
    []
  );

  return (
    <group position={[-5, 0, -3]}>
      {/* Stone base */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial map={stoneTexture} />
      </mesh>

      {/* Balcony */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 2.5]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 4.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.5, 2.2]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>

      {/* Window (front face) */}
      <mesh position={[0, 2, 1.01]}>
        <planeGeometry args={[0.4, 0.5]} />
        <meshStandardMaterial
          color="#ffaa44"
          emissive="#ffaa44"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Door (front face, ground level) */}
      <mesh position={[0, 0.5, 1.01]}>
        <planeGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#3a2510" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
