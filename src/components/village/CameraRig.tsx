import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();
  const timeRef = useRef(0);

  // Define a smooth closed-loop path around the village
  const path = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(12, 8, 12),    // Start: front-right overview
        new THREE.Vector3(8, 7, 4),      // Pan toward watchtower side
        new THREE.Vector3(3, 6, 2),      // Close to village center / quest board
        new THREE.Vector3(-4, 7, 5),     // Library / courier post side
        new THREE.Vector3(-6, 8, 10),    // Pull back left
        new THREE.Vector3(0, 9, 14),     // Wide shot from front
        new THREE.Vector3(8, 8, 13),     // Sweep back right
        new THREE.Vector3(12, 8, 12),    // Loop back to start
      ],
      true, // closed loop
      'catmullrom',
      0.5 // tension (0.5 = moderate smoothness)
    );
  }, []);

  // Look-at target drifts slightly to add life
  const lookTarget = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);
  const smoothLookTarget = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((_, delta) => {
    // Advance along the path (30-second loop)
    timeRef.current = (timeRef.current + delta / 30) % 1;

    // Get position on the spline
    const point = path.getPoint(timeRef.current);
    camera.position.lerp(point, 0.05); // Smooth interpolation

    // Smooth look-at with slight drift based on path position
    const driftX = Math.sin(timeRef.current * Math.PI * 2) * 1.5;
    const driftZ = Math.cos(timeRef.current * Math.PI * 2) * 1;
    lookTarget.set(driftX, 1.5, driftZ);
    smoothLookTarget.current.lerp(lookTarget, 0.02);
    camera.lookAt(smoothLookTarget.current);
  });

  return null; // This component only controls the camera, renders nothing
}
