import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  texturePath: string;
  position: [number, number, number];
  scale?: number;
  bobSpeed?: number;
  bobAmount?: number;
}

export function CharacterSprite({
  texturePath,
  position,
  scale = 0.5,
  bobSpeed = 1.5,
  bobAmount = 0.01,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = position[1];

  const texture = useLoader(THREE.TextureLoader, texturePath);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * bobSpeed) * bobAmount;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh>
          <planeGeometry args={[scale, scale]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
    </group>
  );
}
