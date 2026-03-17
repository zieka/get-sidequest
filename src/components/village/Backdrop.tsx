import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function Backdrop() {
  const texture = useLoader(
    THREE.TextureLoader,
    '/get-sidequest/village/background.png'
  );
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;

  return (
    <mesh position={[0, 5, -8]} scale={[32, 16, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} fog={false} toneMapped={false} />
    </mesh>
  );
}
