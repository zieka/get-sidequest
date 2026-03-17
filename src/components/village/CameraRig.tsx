import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();
  const timeRef = useRef(0);

  // Fixed look direction — set once on mount
  const lookTarget = useRef(new THREE.Vector3(0, 1.5, 0));
  const initialized = useRef(false);

  useFrame((_, delta) => {
    // Set fixed camera orientation on first frame
    if (!initialized.current) {
      camera.position.set(0, 8, 14);
      camera.lookAt(lookTarget.current);
      // Store the rotation so we never change it
      initialized.current = true;
    }

    // Slow horizontal truck: ~60 second full cycle, gentle side-to-side
    timeRef.current += delta / 60;
    const truckX = Math.sin(timeRef.current * Math.PI * 2) * 5;

    // Only move X position — no rotation, no Y/Z change
    camera.position.x = truckX;
  });

  return null;
}
