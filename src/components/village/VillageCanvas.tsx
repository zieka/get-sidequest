import { Canvas } from '@react-three/fiber';
import { VillageScene } from './VillageScene';

export default function VillageCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ background: '#0A0A0F' }}
      >
        <VillageScene />
      </Canvas>
    </div>
  );
}
