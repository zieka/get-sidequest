import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ChimneySmoke() {
  // Workshop chimney is at approximately (6.25, 3.5, 2)
  const chimneyPos: [number, number, number] = [6.25, 3.5, 2];
  const smokePuffs = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!smokePuffs.current) return;
    smokePuffs.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      const speed = 0.3 + i * 0.1;
      const elapsed = state.clock.elapsedTime * speed + i * 2;
      const cycle = elapsed % 4;

      // Rise and drift
      mesh.position.y = chimneyPos[1] + cycle * 0.8;
      mesh.position.x = chimneyPos[0] + Math.sin(elapsed * 0.5) * 0.3;

      // Fade out as it rises, scale up
      const life = cycle / 4;
      material.opacity = 0.3 * (1 - life);
      mesh.scale.setScalar(0.3 + life * 0.5);
    });
  });

  return (
    <group ref={smokePuffs}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={chimneyPos}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color="#888888" transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
