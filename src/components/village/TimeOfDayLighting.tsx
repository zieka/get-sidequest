import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useTimeOfDay } from './useTimeOfDay';

export function TimeOfDayLighting() {
  const preset = useTimeOfDay();
  const { scene } = useThree();

  useEffect(() => {
    scene.background = preset.skyColor;
    scene.fog = new THREE.FogExp2(preset.fogColor.getHex(), preset.fogDensity);
  }, [scene, preset]);

  return (
    <>
      <ambientLight color={preset.ambient} intensity={preset.ambientIntensity} />
      <directionalLight
        color={preset.sun}
        intensity={preset.sunIntensity}
        position={preset.sunPosition}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
    </>
  );
}
