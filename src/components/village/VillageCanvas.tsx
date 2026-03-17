import { Canvas } from '@react-three/fiber';
import { VillageScene } from './VillageScene';
import { useState, useEffect, Suspense } from 'react';

function VillageFallback() {
  const hour = new Date().getHours();
  let variant = 'night';
  if (hour >= 6 && hour < 9) variant = 'dawn';
  else if (hour >= 9 && hour < 17) variant = 'day';
  else if (hour >= 17 && hour < 20) variant = 'dusk';

  // Map time variants to background colors (fallback when images aren't ready)
  const bgColors: Record<string, string> = {
    dawn: '#2a1f3d',
    day: '#1a2a4a',
    dusk: '#1a1030',
    night: '#0A0A1F',
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: bgColors[variant],
        backgroundImage: `url(/get-sidequest/village/${variant}.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

export default function VillageCanvas() {
  const isMobile = useIsMobile();

  if (isMobile) return <VillageFallback />;

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ fov: 85, position: [0, 0, 10] }}
        style={{ background: '#0A0A0F' }}
      >
        <Suspense fallback={null}>
          <VillageScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
