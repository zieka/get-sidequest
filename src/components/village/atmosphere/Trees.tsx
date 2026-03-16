import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

function PixelTree({ position, height = 3 }: { position: [number, number, number]; height?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Procedural tree texture
  const texture = useMemo(() => {
    const size = 16;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d')!;

    // Trunk
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(7, 20, 2, 12);

    // Canopy (layered circles of green)
    const greens = ['#2d6b1e', '#3a7b2a', '#1e5a16', '#4a8b3a'];
    for (let layer = 0; layer < 3; layer++) {
      const y = 4 + layer * 5;
      const w = 12 - layer * 2;
      const x = (size - w) / 2;
      ctx.fillStyle = greens[layer];
      ctx.fillRect(x, y, w, 6);
      // Add pixel variations
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
        ctx.fillRect(x + Math.floor(Math.random() * w), y + Math.floor(Math.random() * 6), 1, 1);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle sway
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        <mesh>
          <planeGeometry args={[height * 0.6, height]} />
          <meshStandardMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
        </mesh>
      </Billboard>
    </group>
  );
}

export function Trees() {
  return (
    <group>
      <PixelTree position={[-7, 1.5, -5]} height={3.5} />
      <PixelTree position={[8, 1.5, -4]} height={3} />
      <PixelTree position={[-6, 1.5, 5]} height={2.8} />
      <PixelTree position={[7, 1.5, 5]} height={3.2} />
      <PixelTree position={[-2, 1.5, -6]} height={2.5} />
      <PixelTree position={[3, 1.5, 6]} height={3} />
    </group>
  );
}
