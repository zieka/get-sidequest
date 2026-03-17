import { useMemo } from 'react';
import * as THREE from 'three';

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const texture = useMemo(() => {
    const size = 8;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, size, size);
    const vars = ['#555555', '#3e3e3e', '#4f4f4f', '#454545'];
    for (let i = 0; i < 15; i++) {
      ctx.fillStyle = vars[Math.floor(Math.random() * vars.length)];
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  return (
    <mesh position={position} castShadow>
      <dodecahedronGeometry args={[scale, 0]} />
      <meshStandardMaterial map={texture} flatShading />
    </mesh>
  );
}

function Bush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const texture = useMemo(() => {
    const size = 8;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#2a5a1e';
    ctx.fillRect(0, 0, size, size);
    const vars = ['#3a6b2a', '#1e4a16', '#2f5e20'];
    for (let i = 0; i < 15; i++) {
      ctx.fillStyle = vars[Math.floor(Math.random() * vars.length)];
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);

  return (
    <mesh position={position}>
      <sphereGeometry args={[scale, 6, 4]} />
      <meshStandardMaterial map={texture} flatShading />
    </mesh>
  );
}

export function ForegroundElements() {
  return (
    <group>
      {/* Near-camera foreground — will be blurred by DoF, framing the scene */}
      <Rock position={[-6, 0.4, 6]} scale={0.8} />
      <Rock position={[7, 0.3, 6.5]} scale={0.6} />
      <Bush position={[-7, 0.5, 5.5]} scale={0.7} />
      <Bush position={[6, 0.4, 6]} scale={0.5} />
      <Bush position={[-5, 0.6, 7]} scale={0.8} />
      <Bush position={[8, 0.5, 5.5]} scale={0.6} />

      {/* Behind buildings — background blur layer */}
      <Rock position={[-6, 0.3, -4]} scale={0.7} />
      <Rock position={[7, 0.4, -5]} scale={0.5} />
      <Bush position={[-5, 0.5, -3.5]} scale={0.6} />
      <Bush position={[6, 0.4, -4]} scale={0.8} />
    </group>
  );
}
