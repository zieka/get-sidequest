import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0.01}
        focalLength={0.03}
        bokehScale={6}
      />
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
}
