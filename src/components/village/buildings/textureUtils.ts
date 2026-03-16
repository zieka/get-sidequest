import * as THREE from 'three';

export function createPixelTexture(
  size: number,
  baseColor: string,
  variations: string[],
  density: number = 40
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < density; i++) {
    ctx.fillStyle = variations[Math.floor(Math.random() * variations.length)];
    ctx.fillRect(
      Math.floor(Math.random() * size),
      Math.floor(Math.random() * size),
      1,
      1
    );
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}
