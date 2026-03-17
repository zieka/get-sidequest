import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();
  const timeRef = useRef(0);

  const lookTarget = useRef(new THREE.Vector3(0, 1.5, 0));
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      // Lower angle — camera closer to ground, looking slightly up at the scene
      camera.position.set(0, 5, 10);
      camera.lookAt(lookTarget.current);
      initialized.current = true;
    }

    // Very slow truck: ~120 second full cycle, subtle side-to-side
    // "Living picture" — barely perceptible movement
    timeRef.current += delta / 120;
    const truckX = Math.sin(timeRef.current * Math.PI * 2) * 3;

    camera.position.x = truckX;
  });

  return null;
}
