import { useMemo } from 'react';
import * as THREE from 'three';
import { createPixelTexture } from './textureUtils';

export function Library() {
  const woodTexture = useMemo(
    () => createPixelTexture(16, '#8B7355', ['#7a6245', '#9b8365']),
    []
  );

  const roofTexture = useMemo(
    () => createPixelTexture(16, '#8B4513', ['#7a3a0f', '#9b5523']),
    []
  );

  return (
    <group position={[4, 0, -2]}>
      {/* Warm wood base */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.5, 2.5]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 1, 3]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>

      {/* Left window (front face) */}
      <mesh position={[-0.6, 1.5, 1.26]}>
        <planeGeometry args={[0.4, 0.5]} />
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ffcc66"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right window (front face) */}
      <mesh position={[0.6, 1.5, 1.26]}>
        <planeGeometry args={[0.4, 0.5]} />
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ffcc66"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Door (front face) */}
      <mesh position={[0, 0.55, 1.26]}>
        <planeGeometry args={[0.5, 1.1]} />
        <meshStandardMaterial color="#3a2510" side={THREE.DoubleSide} />
      </mesh>

      {/* Book stack / bench beside door */}
      <mesh position={[1.0, 0.2, 1.4]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
    </group>
  );
}
