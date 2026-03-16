import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={4}
      />
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
}
