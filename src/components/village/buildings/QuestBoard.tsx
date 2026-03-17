import { useMemo } from 'react';
import * as THREE from 'three';
import { createPixelTexture } from './textureUtils';

export function QuestBoard() {
  const woodTexture = useMemo(
    () => createPixelTexture(16, '#8B6914', ['#7a5c12', '#9b7924']),
    []
  );

  return (
    <group position={[0, 0, 0.5]}>
      {/* Left support post */}
      <mesh position={[-0.6, 0.75, 0]} castShadow>
        <boxGeometry args={[0.15, 1.5, 0.15]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>

      {/* Right support post */}
      <mesh position={[0.6, 0.75, 0]} castShadow>
        <boxGeometry args={[0.15, 1.5, 0.15]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>

      {/* Main board */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Parchment 1 (top left) */}
      <mesh position={[-0.35, 1.15, 0.06]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial
          color="#f5e6c8"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Parchment 2 (top right) */}
      <mesh position={[0.25, 1.2, 0.06]}>
        <planeGeometry args={[0.3, 0.35]} />
        <meshStandardMaterial
          color="#f0ddb8"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Parchment 3 (bottom center) */}
      <mesh position={[-0.05, 0.8, 0.06]}>
        <planeGeometry args={[0.28, 0.38]} />
        <meshStandardMaterial
          color="#eedcb0"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Parchment 4 (bottom right) */}
      <mesh position={[0.35, 0.78, 0.06]}>
        <planeGeometry args={[0.25, 0.3]} />
        <meshStandardMaterial
          color="#f5e6c8"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
