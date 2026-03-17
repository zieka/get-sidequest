import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function Backdrop() {
  const texture = useLoader(
    THREE.TextureLoader,
    '/get-sidequest/village/background.png'
  );
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;

  // Fixed scale large enough to fill any viewport at this distance
  // Camera at z=10, plane at z=-5, distance=15, FOV=75°
  // Visible height ~23 units, width ~42 units at 16:9
  // Scale 50% larger than needed so camera truck never reveals edges
  // Image aspect ratio: 1408/768 = 1.833
  return (
    <mesh position={[0, 0, -5]} scale={[64, 35, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} fog={false} toneMapped={false} />
    </mesh>
  );
}
