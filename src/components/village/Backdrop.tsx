import { useLoader, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

export function Backdrop() {
  const texture = useLoader(
    THREE.TextureLoader,
    '/get-sidequest/village/background.png'
  );
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;

  const { viewport } = useThree();

  // Scale the plane to always fill the viewport with generous overflow
  // so camera truck never reveals edges
  const imageAspect = 1408 / 768;
  const scale = useMemo(() => {
    // Make it 50% larger than the viewport in both dimensions
    const viewWidth = viewport.width * 1.5;
    const viewHeight = viewport.height * 1.5;

    // Fit by covering (like CSS background-size: cover)
    const viewAspect = viewWidth / viewHeight;
    let w: number, h: number;
    if (imageAspect > viewAspect) {
      h = viewHeight;
      w = h * imageAspect;
    } else {
      w = viewWidth;
      h = w / imageAspect;
    }
    return [w, h, 1] as [number, number, number];
  }, [viewport.width, viewport.height]);

  return (
    <mesh position={[0, 0, -5]} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} fog={false} toneMapped={false} />
    </mesh>
  );
}
