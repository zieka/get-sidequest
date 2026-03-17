import { useMemo } from 'react';
import * as THREE from 'three';

export function Terrain() {
  const grassTexture = useMemo(() => {
    const size = 16;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base green
    ctx.fillStyle = '#2d5a1e';
    ctx.fillRect(0, 0, size, size);

    // Variation pixels
    const variations = ['#3a6b2a', '#245216', '#2f5e20', '#357228'];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = variations[Math.floor(Math.random() * variations.length)];
      ctx.fillRect(
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size),
        1, 1
      );
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    return texture;
  }, []);

  const pathTexture = useMemo(() => {
    const size = 16;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#6b5a3e';
    ctx.fillRect(0, 0, size, size);

    const variations = ['#7a654a', '#5e4e35', '#6f5d42'];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = variations[Math.floor(Math.random() * variations.length)];
      ctx.fillRect(
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size),
        1, 1
      );
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 12);
    return texture;
  }, []);

  return (
    <group>
      {/* Main grass ground — tighter, more rectangular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      {/* Dirt path through village — horizontal, connecting buildings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]} receiveShadow>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial map={pathTexture} />
      </mesh>

      {/* Small pond/stream area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.02, -1]} receiveShadow>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#1a3a5a" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
