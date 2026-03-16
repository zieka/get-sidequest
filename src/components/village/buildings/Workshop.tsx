import { useMemo } from 'react';
import * as THREE from 'three';
import { createPixelTexture } from './textureUtils';

export function Workshop() {
  const brickTexture = useMemo(
    () => createPixelTexture(16, '#5a4a3a', ['#6b5a4a', '#4a3a2a']),
    []
  );

  const darkWoodTexture = useMemo(
    () => createPixelTexture(16, '#4a3520', ['#5a4530', '#3a2510']),
    []
  );

  const chimneyTexture = useMemo(
    () => createPixelTexture(16, '#4a3a2a', ['#3a2a1a', '#5a4a3a']),
    []
  );

  return (
    <group position={[5, 0, 2]}>
      {/* Dark stone/brick base */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 2, 2.5]} />
        <meshStandardMaterial map={brickTexture} />
      </mesh>

      {/* Dark wood roof */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.8, 3]} />
        <meshStandardMaterial map={darkWoodTexture} />
      </mesh>

      {/* Chimney on the right side of the roof */}
      <mesh position={[1.2, 3.6, -0.5]} castShadow>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial map={chimneyTexture} />
      </mesh>

      {/* Window (front face) */}
      <mesh position={[-0.5, 1.2, 1.26]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          color="#ff8833"
          emissive="#ff8833"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Door (front face) */}
      <mesh position={[0.5, 0.5, 1.26]}>
        <planeGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#2a1a0a" side={THREE.DoubleSide} />
      </mesh>

      {/* Anvil detail outside front door */}
      <mesh position={[0.5, 0.15, 1.6]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}
