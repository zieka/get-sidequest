import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { Backdrop } from './Backdrop';
import { Characters } from './Characters';
import { Particles } from './atmosphere/Particles';
import { Effects } from './Effects';

export interface VillageAssets {
  backdrop: string;
  supervisor: string;
  chronicler: string;
  courier: string;
}

interface Props {
  assets: VillageAssets;
  active: boolean;
  onReady: () => void;
}

// Shares the Suspense boundary with the textures, so it only mounts once they have loaded.
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export default function VillageScene({ assets, active, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ fov: 85, position: [0, 0, 10] }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <Backdrop url={assets.backdrop} />
        <Characters assets={assets} />
        <Particles />
        <Effects />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
