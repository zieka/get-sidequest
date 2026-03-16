import { useMemo } from 'react';
import * as THREE from 'three';

export interface TimePreset {
  ambient: THREE.Color;
  ambientIntensity: number;
  sun: THREE.Color;
  sunIntensity: number;
  sunPosition: [number, number, number];
  skyColor: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  windowGlow: number;
}

const PRESETS: Record<string, TimePreset> = {
  dawn: {
    ambient: new THREE.Color('#4a3f6b'),
    ambientIntensity: 0.3,
    sun: new THREE.Color('#ff9e6e'),
    sunIntensity: 0.6,
    sunPosition: [15, 3, 5],
    skyColor: new THREE.Color('#2a1f3d'),
    fogColor: new THREE.Color('#3d2f5a'),
    fogDensity: 0.02,
    windowGlow: 0.6,
  },
  day: {
    ambient: new THREE.Color('#87CEEB'),
    ambientIntensity: 0.5,
    sun: new THREE.Color('#fffbe6'),
    sunIntensity: 1.2,
    sunPosition: [10, 15, 5],
    skyColor: new THREE.Color('#1a2a4a'),
    fogColor: new THREE.Color('#2a3a5a'),
    fogDensity: 0.008,
    windowGlow: 0.1,
  },
  dusk: {
    ambient: new THREE.Color('#6b3f4a'),
    ambientIntensity: 0.35,
    sun: new THREE.Color('#ff7043'),
    sunIntensity: 0.7,
    sunPosition: [-15, 4, 5],
    skyColor: new THREE.Color('#1a1030'),
    fogColor: new THREE.Color('#2d1f40'),
    fogDensity: 0.015,
    windowGlow: 0.8,
  },
  night: {
    ambient: new THREE.Color('#1a1a3e'),
    ambientIntensity: 0.15,
    sun: new THREE.Color('#8090c0'),
    sunIntensity: 0.2,
    sunPosition: [5, 12, -5],
    skyColor: new THREE.Color('#0A0A1F'),
    fogColor: new THREE.Color('#0f0f2a'),
    fogDensity: 0.02,
    windowGlow: 1.0,
  },
};

function lerpPresets(a: TimePreset, b: TimePreset, t: number): TimePreset {
  return {
    ambient: a.ambient.clone().lerp(b.ambient, t),
    ambientIntensity: THREE.MathUtils.lerp(a.ambientIntensity, b.ambientIntensity, t),
    sun: a.sun.clone().lerp(b.sun, t),
    sunIntensity: THREE.MathUtils.lerp(a.sunIntensity, b.sunIntensity, t),
    sunPosition: a.sunPosition.map((v, i) =>
      THREE.MathUtils.lerp(v, b.sunPosition[i], t)
    ) as [number, number, number],
    skyColor: a.skyColor.clone().lerp(b.skyColor, t),
    fogColor: a.fogColor.clone().lerp(b.fogColor, t),
    fogDensity: THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, t),
    windowGlow: THREE.MathUtils.lerp(a.windowGlow, b.windowGlow, t),
  };
}

export function useTimeOfDay(): TimePreset {
  return useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) return lerpPresets(PRESETS.night, PRESETS.dawn, (hour - 5) / 2);
    if (hour >= 7 && hour < 9) return lerpPresets(PRESETS.dawn, PRESETS.day, (hour - 7) / 2);
    if (hour >= 9 && hour < 16) return PRESETS.day;
    if (hour >= 16 && hour < 18) return lerpPresets(PRESETS.day, PRESETS.dusk, (hour - 16) / 2);
    if (hour >= 18 && hour < 20) return lerpPresets(PRESETS.dusk, PRESETS.night, (hour - 18) / 2);
    return PRESETS.night;
  }, []);
}
