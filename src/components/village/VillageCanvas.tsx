import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { VillageAssets } from './VillageScene';

// Separate chunk: three.js only downloads where the scene will actually run.
const VillageScene = lazy(() => import('./VillageScene'));

// Phones, tablets and reduced-motion users keep the static poster from Hero.astro;
// the scene adds nothing there but motion and battery drain.
function useSceneAllowed() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 768px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const touchDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const update = () => setAllowed(desktop.matches && !reduced.matches && !touchDevice);
    update();
    desktop.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return allowed;
}

function useInView(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

// No WebGL or a failed chunk load: render nothing and let the poster stand.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function VillageCanvas({ assets }: { assets: VillageAssets }) {
  const ref = useRef<HTMLDivElement>(null);
  const allowed = useSceneAllowed();
  const inView = useInView(ref);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!allowed) setReady(false);
  }, [allowed]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-700 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      {allowed && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <VillageScene assets={assets} active={inView} onReady={onReady} />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
