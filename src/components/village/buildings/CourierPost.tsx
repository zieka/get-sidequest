import { useMemo } from 'react';
import * as THREE from 'three';
import { createPixelTexture } from './textureUtils';

export function CourierPost() {
  const woodTexture = useMemo(
    () => createPixelTexture(16, '#a0845c', ['#8f7350', '#b19568']),
    []
  );

  const thatchTexture = useMemo(
    () => createPixelTexture(16, '#c4a946', ['#b39838', '#d4b956']),
    []
  );

  return (
    <group position={[-4, 0, 3]}>
      {/* Wood plank base */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Thatch roof */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.8, 2.5]} />
        <meshStandardMaterial map={thatchTexture} />
      </mesh>

      {/* Signpost — vertical plane above roof */}
      <mesh position={[0.8, 3.2, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.05]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      {/* Sign board */}
      <mesh position={[0.8, 3.5, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color="#c4a946"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Door (front face) */}
      <mesh position={[0, 0.5, 1.01]}>
        <planeGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#3a2510" side={THREE.DoubleSide} />
      </mesh>

      {/* Mailbox detail near door */}
      <mesh position={[-0.7, 0.3, 1.2]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshStandardMaterial color="#6b5a3e" />
      </mesh>
    </group>
  );
}
