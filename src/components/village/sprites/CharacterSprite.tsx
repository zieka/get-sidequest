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
  scale = 1.5,
  bobSpeed = 1.5,
  bobAmount = 0.05,
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
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
      {/* Drop shadow on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02 - position[1], 0]}>
        <circleGeometry args={[scale * 0.35, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}
