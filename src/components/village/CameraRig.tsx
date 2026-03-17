import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export function CameraRig() {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      // Camera looks straight at the backdrop plane, not angled down
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      initialized.current = true;
    }

    // Very slow truck: 120s full cycle, barely perceptible
    timeRef.current += delta / 120;
    const truckX = Math.sin(timeRef.current * Math.PI * 2) * 1.5;

    camera.position.x = truckX;
  });

  return null;
}
