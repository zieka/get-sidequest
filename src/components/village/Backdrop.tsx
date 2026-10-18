import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Plane matches the 1408x768 art. From the camera (z=10, fov 85°) the plane at z=-5 shows
// 27.5 units of height, so the art appears 35 / 27.5 ≈ 1.273× zoomed. Wider than ~2.2:1 the
// plane grows to keep covering the view plus the camera truck.
// NOTE: `.hero-poster` in Hero.astro mirrors this math so the canvas fades in without a jump.
const WIDTH = 64;
const HEIGHT = 35;
const TRUCK = 1.5; // CameraRig sway on each side

export function Backdrop({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;

  const { viewport, camera } = useThree();
  const visible = viewport.getCurrentViewport(camera, [0, 0, -5]);
  const grow = Math.max(1, (visible.width + 2 * TRUCK) / WIDTH);

  return (
    <mesh position={[0, 0, -5]} scale={[WIDTH * grow, HEIGHT * grow, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
