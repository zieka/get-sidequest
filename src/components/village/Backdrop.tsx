import { useMemo } from 'react';
import * as THREE from 'three';

export function Backdrop() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
    skyGrad.addColorStop(0, '#1a1a3e');
    skyGrad.addColorStop(0.4, '#2a2a5e');
    skyGrad.addColorStop(0.7, '#3d2f5a');
    skyGrad.addColorStop(1, '#4a3f6b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 512, 160);

    // Distant mountain silhouettes
    ctx.fillStyle = '#1a1530';
    ctx.beginPath();
    ctx.moveTo(0, 160);
    // Rolling hills shape
    for (let x = 0; x <= 512; x += 4) {
      const y = 140 + Math.sin(x * 0.015) * 15 + Math.sin(x * 0.03) * 8 + Math.sin(x * 0.007) * 20;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(512, 256);
    ctx.lineTo(0, 256);
    ctx.closePath();
    ctx.fill();

    // Second mountain layer, slightly lighter
    ctx.fillStyle = '#252040';
    ctx.beginPath();
    ctx.moveTo(0, 170);
    for (let x = 0; x <= 512; x += 4) {
      const y = 155 + Math.sin(x * 0.02 + 1) * 12 + Math.sin(x * 0.04 + 2) * 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(512, 256);
    ctx.lineTo(0, 256);
    ctx.closePath();
    ctx.fill();

    // Distant treeline silhouettes
    ctx.fillStyle = '#1e1a35';
    for (let x = 0; x < 512; x += 6) {
      const h = 5 + Math.random() * 10;
      const baseY = 165 + Math.sin(x * 0.02 + 1) * 10;
      ctx.fillRect(x, baseY - h, 5, h);
    }

    // Distant building silhouettes (towers, rooftops)
    ctx.fillStyle = '#201a38';
    const buildingPositions = [80, 150, 220, 300, 380, 440];
    for (const bx of buildingPositions) {
      const bh = 15 + Math.random() * 25;
      const bw = 8 + Math.random() * 12;
      const baseY = 158 + Math.sin(bx * 0.02) * 8;
      ctx.fillRect(bx - bw / 2, baseY - bh, bw, bh);
      // Tiny roof point
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2 - 2, baseY - bh);
      ctx.lineTo(bx, baseY - bh - 8);
      ctx.lineTo(bx + bw / 2 + 2, baseY - bh);
      ctx.closePath();
      ctx.fill();
    }

    // Ground area below horizon
    const groundGrad = ctx.createLinearGradient(0, 170, 0, 256);
    groundGrad.addColorStop(0, '#1a1530');
    groundGrad.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, 180, 512, 76);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.LinearFilter; // Smooth, not pixelated — this is a painted backdrop
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);

  return (
    <mesh position={[0, 8, -20]} scale={[60, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} fog={false} />
    </mesh>
  );
}
