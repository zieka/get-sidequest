# HD-2D Village Hero Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an Octopath Traveler-inspired HD-2D Three.js village scene as the hero section of the Sidequest marketing site, featuring pixel art characters from the app, cinematic camera panning via Theater.js, time-of-day-aware lighting, and a mobile static fallback.

**Architecture:** A client-side-only React component renders a Three.js scene within an Astro page. The scene uses textured geometry for terrain and buildings, billboarded sprite quads for pixel art characters, and a post-processing pipeline (depth of field, bloom) for the HD-2D look. Theater.js choreographs the camera. Time-of-day is read from `Date` and interpolated across 4 lighting presets.

**Tech Stack:** Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Theater.js (@theatre/core, @theatre/r3f), React, Astro (client:only="react")

**Design doc:** `docs/plans/2026-03-16-marketing-docs-site-design.md`

---

### Task 1: Install Dependencies and Set Up Client Component Scaffold

**Files:**
- Modify: `package.json`
- Create: `src/components/village/VillageScene.tsx`
- Create: `src/components/village/VillageCanvas.tsx`
- Modify: `src/components/marketing/Hero.astro`

**Step 1: Install Three.js ecosystem and Theater.js**

```bash
bun add three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing @theatre/core @theatre/r3f react react-dom @types/three
```

Note: React/ReactDOM may already be installed. The key packages:
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Helpers (OrthographicCamera, Billboard, Sprite, etc.)
- `@react-three/postprocessing` — Post-processing effects (DoF, bloom)
- `@theatre/core` + `@theatre/r3f` — Animation choreography
- `postprocessing` — Underlying post-processing library

**Step 2: Create the canvas wrapper**

Create `src/components/village/VillageCanvas.tsx` — the top-level React component that Astro will mount:

```tsx
import { Canvas } from '@react-three/fiber';
import { VillageScene } from './VillageScene';

export default function VillageCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
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
```

**Step 3: Create the scene placeholder**

Create `src/components/village/VillageScene.tsx` — start with a minimal scene to verify the pipeline works:

```tsx
import { useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export function VillageScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7C3AED" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>
    </>
  );
}
```

**Step 4: Update Hero.astro to mount the React component**

Replace the current screenshot placeholder in `Hero.astro` with the Three.js canvas. The canvas sits behind the text overlay:

```astro
---
import VillageCanvas from '../village/VillageCanvas';
const base = import.meta.env.BASE_URL;
---

<section class="relative overflow-hidden h-screen min-h-[600px] max-h-[900px]">
  <!-- Three.js Canvas -->
  <VillageCanvas client:only="react" />

  <!-- Dark gradient overlay for text readability -->
  <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

  <!-- Text overlay -->
  <div class="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
    <h1 class="font-heading text-5xl md:text-7xl tracking-tight leading-[1.1] mb-6">
      Your AI development team,
      <span class="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">orchestrated.</span>
    </h1>

    <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
      Run parallel Claude Code agents, supervise them automatically, and ship faster than ever.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="https://github.com/zieka/get-sidequest/releases/latest"
        class="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-accent to-cyan-400 hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
      >
        Download for macOS
      </a>
      <a
        href={`${base}docs/`}
        class="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
      >
        Read the docs
      </a>
    </div>
  </div>
</section>
```

**Step 5: Verify build and dev server**

```bash
bun run dev
```

Visit `http://localhost:4321/get-sidequest/`. Verify the purple cube renders behind the hero text. The canvas should fill the hero section. Kill dev server.

```bash
bun run build
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Three.js village canvas with React integration"
```

---

### Task 2: Build Terrain and Ground Plane

**Files:**
- Create: `src/components/village/Terrain.tsx`
- Modify: `src/components/village/VillageScene.tsx`

**Step 1: Create terrain component**

The terrain is a textured ground plane with slight elevation variation. For HD-2D style, use a large plane with a grass/earth material. The ground should have a subtle pixel-art-friendly texture (can be procedurally generated or a small tiled pixel texture scaled up with nearest-neighbor filtering).

```tsx
import { useMemo } from 'react';
import * as THREE from 'three';

export function Terrain() {
  const grassTexture = useMemo(() => {
    // Create a small pixel art grass texture programmatically
    const size = 16;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base green
    ctx.fillStyle = '#2d5a1e';
    ctx.fillRect(0, 0, size, size);

    // Variation pixels
    const variations = ['#3a6b2a', '#245216', '#2f5e20', '#357228'];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = variations[Math.floor(Math.random() * variations.length)];
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      ctx.fillRect(x, y, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    return texture;
  }, []);

  // Create a path texture overlay (dirt path through the village)
  const pathTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#6b5a3e';
    ctx.fillRect(0, 0, size, size);

    const variations = ['#7a654a', '#5e4e35', '#6f5d42'];
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = variations[Math.floor(Math.random() * variations.length)];
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      ctx.fillRect(x, y, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 8);
    return texture;
  }, []);

  return (
    <group>
      {/* Main grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      {/* Dirt path — a slightly raised plane cutting through the village */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3, 20]} />
        <meshStandardMaterial map={pathTexture} />
      </mesh>
    </group>
  );
}
```

**Step 2: Add terrain to VillageScene**

Replace the placeholder mesh in VillageScene with the Terrain component. Keep the camera and lights.

**Step 3: Verify visually in dev server**

```bash
bun run dev
```

Should see a green ground plane with a dirt path. Camera looking down at it isometrically.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add procedural pixel art terrain with grass and dirt path"
```

---

### Task 3: Build Village Buildings

**Files:**
- Create: `src/components/village/buildings/Watchtower.tsx`
- Create: `src/components/village/buildings/Library.tsx`
- Create: `src/components/village/buildings/CourierPost.tsx`
- Create: `src/components/village/buildings/Workshop.tsx`
- Create: `src/components/village/buildings/QuestBoard.tsx`
- Create: `src/components/village/Buildings.tsx` (composes all buildings)
- Modify: `src/components/village/VillageScene.tsx`

**Approach:** Each building is constructed from simple Three.js geometry (boxes, planes) with procedurally generated pixel art textures. The HD-2D style means buildings should look like pixel art from the front but have 3D depth. Use `THREE.NearestFilter` on all textures for crisp pixelation.

**Building construction pattern:** Each building is a group of meshes:
- A box for the main structure (walls)
- A slightly wider box or prism on top (roof)
- Small plane details (windows with emissive glow, doors, signs)
- Each building uses procedural canvas textures drawn pixel-by-pixel

**Key visual elements per building:**

- **Watchtower:** Tall, narrow stone tower with a wooden balcony at top. Lantern glow.
- **Library:** Cozy building with arched windows, bookshelves visible inside (emissive warm glow).
- **Courier Post:** Small building with a mailbox/sign, wooden door, package pile outside.
- **Workshop:** Wider building with a chimney (for smoke particles later), anvil or workbench outside.
- **Quest Board:** A standalone wooden board on posts in the village square, with small parchment rectangles pinned to it.

Each building should be roughly 2-4 units wide, 2-5 units tall in scene scale.

**Layout:** Buildings arranged around a small village square, with the quest board in the center. The dirt path connects them.

Approximate positions (x, z):
- Quest Board: (0, 0) — center
- Watchtower: (-5, -3) — back left
- Library: (4, -2) — back right
- Courier Post: (-4, 3) — front left
- Workshop: (5, 2) — front right

**Step 1:** Create each building component with procedural textures. Start with simple box geometry — iterate on visual quality after the layout works.

**Step 2:** Create `Buildings.tsx` that places all buildings in the scene.

**Step 3:** Add to VillageScene.

**Step 4:** Verify visually — all 5 structures visible from the camera angle.

**Step 5:** Commit.

```bash
git add -A
git commit -m "feat: add village buildings with procedural pixel art textures"
```

---

### Task 4: Implement Time-of-Day Lighting System

**Files:**
- Create: `src/components/village/TimeOfDayLighting.tsx`
- Create: `src/components/village/useTimeOfDay.ts`
- Modify: `src/components/village/VillageScene.tsx`

**Step 1: Create the time-of-day hook**

```tsx
// useTimeOfDay.ts
import { useMemo } from 'react';
import * as THREE from 'three';

interface TimePreset {
  ambient: THREE.Color;
  ambientIntensity: number;
  sun: THREE.Color;
  sunIntensity: number;
  sunPosition: [number, number, number];
  skyColor: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  windowGlow: number; // 0-1 how bright building windows are
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

export function useTimeOfDay() {
  return useMemo(() => {
    const hour = new Date().getHours();

    // Map hour ranges to preset blends
    if (hour >= 5 && hour < 7) return lerpPresets(PRESETS.night, PRESETS.dawn, (hour - 5) / 2);
    if (hour >= 7 && hour < 9) return lerpPresets(PRESETS.dawn, PRESETS.day, (hour - 7) / 2);
    if (hour >= 9 && hour < 16) return PRESETS.day;
    if (hour >= 16 && hour < 18) return lerpPresets(PRESETS.day, PRESETS.dusk, (hour - 16) / 2);
    if (hour >= 18 && hour < 20) return lerpPresets(PRESETS.dusk, PRESETS.night, (hour - 18) / 2);
    return PRESETS.night;
  }, []);
}

function lerpPresets(a: TimePreset, b: TimePreset, t: number): TimePreset {
  return {
    ambient: a.ambient.clone().lerp(b.ambient, t),
    ambientIntensity: THREE.MathUtils.lerp(a.ambientIntensity, b.ambientIntensity, t),
    sun: a.sun.clone().lerp(b.sun, t),
    sunIntensity: THREE.MathUtils.lerp(a.sunIntensity, b.sunIntensity, t),
    sunPosition: a.sunPosition.map((v, i) => THREE.MathUtils.lerp(v, b.sunPosition[i], t)) as [number, number, number],
    skyColor: a.skyColor.clone().lerp(b.skyColor, t),
    fogColor: a.fogColor.clone().lerp(b.fogColor, t),
    fogDensity: THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, t),
    windowGlow: THREE.MathUtils.lerp(a.windowGlow, b.windowGlow, t),
  };
}
```

**Step 2: Create TimeOfDayLighting component**

Uses the hook to set ambient light, directional light (sun/moon), fog, and scene background color.

**Step 3: Add to VillageScene, replacing hardcoded lights.**

**Step 4: Verify at different times** — temporarily override the hour to test dawn/day/dusk/night. Each should feel distinctly different.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add time-of-day lighting system with dawn/day/dusk/night presets"
```

---

### Task 5: Add Pixel Art Character Sprites

**Files:**
- Create: `src/components/village/sprites/CharacterSprite.tsx`
- Create: `src/components/village/sprites/SupervisorSprite.tsx`
- Create: `src/components/village/sprites/ChroniclerSprite.tsx`
- Create: `src/components/village/sprites/CourierSprite.tsx`
- Create: `src/components/village/Characters.tsx`
- Copy pixel art assets to: `public/sprites/`
- Modify: `src/components/village/VillageScene.tsx`

**Step 1: Export pixel art from the sidequest app**

The SVG pixel art components in the sidequest app render to canvas. We need static sprite sheet PNGs for Three.js. Two approaches:

Option A: Render each SVG component to a canvas at 64x64 or 128x128 and export as PNG. This can be done manually or with a script.

Option B: Recreate simplified versions as small pixel art PNGs (32x32) manually or extract the key colors/shapes from the SVG source.

For MVP, take the portrait PNGs that already exist:
```bash
mkdir -p public/sprites
cp /Users/kylescully/Repos/sidequest/src/assets/portraits/supervisor.png public/sprites/supervisor.png
cp /Users/kylescully/Repos/sidequest/src/assets/portraits/chronicler.png public/sprites/chronicler.png
cp /Users/kylescully/Repos/sidequest/src/assets/portraits/wizard-cat.png public/sprites/courier.png
```

These are larger portrait images. If they're too detailed for the scene scale, create smaller cropped versions. The key is `THREE.NearestFilter` for pixelated rendering.

**Step 2: Create CharacterSprite base component**

A billboarded quad that always faces the camera, with a pixel art texture:

```tsx
import { Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  texture: string;
  position: [number, number, number];
  scale?: number;
}

export function CharacterSprite({ texture: texturePath, position, scale = 1 }: Props) {
  const texture = useTexture(texturePath);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <mesh>
        <planeGeometry args={[scale, scale]} />
        <meshStandardMaterial map={texture} transparent alphaTest={0.5} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  );
}
```

**Step 3: Create individual character sprites**

Each character sprite wraps CharacterSprite with positioning and subtle idle animation (gentle bobbing via useFrame):

- **SupervisorSprite** — positioned on the watchtower balcony
- **ChroniclerSprite** — positioned near the library entrance
- **CourierSprite** — positioned on the path, with a slow walking animation (translate along a path over time)

**Step 4: Create Characters.tsx composing all three.**

**Step 5: Add to VillageScene.**

**Step 6: Verify — characters visible at correct positions, billboarding works, textures crisp.**

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add pixel art character sprites with idle animations"
```

---

### Task 6: Add Post-Processing (Depth of Field + Bloom)

**Files:**
- Create: `src/components/village/Effects.tsx`
- Modify: `src/components/village/VillageScene.tsx`

**Step 1: Create the effects component**

```tsx
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
```

The depth of field creates the tilt-shift miniature diorama look that defines HD-2D. Bloom makes light sources (windows, lanterns) glow. Vignette darkens edges for cinematic feel.

**Step 2: Add to VillageScene as a child of Canvas (inside the scene).**

**Step 3: Tune the DoF parameters** — the focal point should be roughly at the center of the village. Too aggressive = blurry mess. Too subtle = doesn't read as HD-2D. The bokeh scale of 3-5 is typically the sweet spot.

**Step 4: Verify visually** — foreground and background should be softly blurred, center village sharp.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add post-processing effects (DoF, bloom, vignette)"
```

---

### Task 7: Add Atmospheric Details

**Files:**
- Create: `src/components/village/atmosphere/Particles.tsx`
- Create: `src/components/village/atmosphere/ChimneySmoke.tsx`
- Create: `src/components/village/atmosphere/Foliage.tsx`
- Create: `src/components/village/Atmosphere.tsx`
- Modify: `src/components/village/VillageScene.tsx`

**Particles:** Time-of-day aware:
- **Night:** Fireflies — small glowing yellow/green points that drift slowly and randomly blink
- **Day / Golden hour:** Dust motes — tiny white particles floating in sunbeams
- **Dusk / Dawn:** Leaves — small colored quads drifting gently

Use `@react-three/drei`'s `Points` or Three.js `BufferGeometry` with `PointsMaterial` for particles. Keep count low (50-100) for performance.

**Chimney smoke:** A few semi-transparent quads rising slowly from the workshop chimney, fading out as they rise. Use `useFrame` to animate position and opacity.

**Foliage:** 2-3 pixel art trees near the buildings. Simple billboard sprites (like characters) with a very subtle scale oscillation for wind sway. Use the same procedural pixel art approach as terrain textures.

**Step 1:** Build each atmospheric component.

**Step 2:** Create `Atmosphere.tsx` composing them, passing time-of-day data.

**Step 3:** Add to VillageScene.

**Step 4:** Verify — subtle, not overwhelming. The scene should feel alive but calm.

**Step 5:** Commit

```bash
git add -A
git commit -m "feat: add atmospheric effects (particles, smoke, foliage)"
```

---

### Task 8: Theater.js Camera Choreography

**Files:**
- Create: `src/components/village/CameraRig.tsx`
- Create: `src/components/village/village-animation.json` (Theater.js project state)
- Modify: `src/components/village/VillageScene.tsx`
- Modify: `src/components/village/VillageCanvas.tsx`

**Step 1: Set up Theater.js project**

```tsx
// In VillageCanvas.tsx
import { getProject } from '@theatre/core';
import { SheetProvider } from '@theatre/r3f';
import villageAnimation from './village-animation.json';

const project = getProject('Village', { state: villageAnimation });
const sheet = project.sheet('Camera');
```

Wrap the scene in `<SheetProvider sheet={sheet}>`.

**Step 2: Create CameraRig**

A Theater.js-animated camera that slowly pans across the village in a ~30-second loop:

```tsx
import { PerspectiveCamera } from '@react-three/drei';
import { editable as e } from '@theatre/r3f';
import { useEffect } from 'react';
import { val } from '@theatre/core';

export function CameraRig({ sheet }) {
  useEffect(() => {
    // Auto-play the animation in a loop
    const playback = sheet.sequence.play({ iterationCount: Infinity, range: [0, 30] });
    return () => playback.then(p => p?.pause?.());
  }, [sheet]);

  return (
    <e.perspectiveCamera
      theatreKey="Camera"
      makeDefault
      fov={35}
      near={0.1}
      far={100}
      position={[12, 8, 12]}
      rotation={[-0.5, 0.7, 0.3]}
    />
  );
}
```

**Step 3: Create the animation state**

The camera path should:
1. Start looking at the quest board in the village center
2. Slowly pan to reveal the watchtower and supervisor robot
3. Drift past the library with the chronicler owl
4. Follow the path where the courier cat walks
5. Pull back to show the full village
6. Smoothly loop back to the start

For the initial implementation, define keyframes programmatically or use Theater.js Studio (dev tool) to visually choreograph the path, then export the state JSON.

If Theater.js Studio is too complex for CLI implementation, use a simpler approach: a custom camera animation with `useFrame` that follows a predefined spline path using `THREE.CatmullRomCurve3`.

**Fallback approach (no Theater.js dependency):**

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const timeRef = useRef(0);

  const path = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(12, 8, 12),   // Start: overview
      new THREE.Vector3(8, 7, 5),     // Pan toward watchtower
      new THREE.Vector3(2, 6, 3),     // Village center / quest board
      new THREE.Vector3(-4, 7, 6),    // Library side
      new THREE.Vector3(-2, 8, 12),   // Pull back
      new THREE.Vector3(6, 9, 14),    // Wide shot
      new THREE.Vector3(12, 8, 12),   // Loop back
    ], true); // closed loop
  }, []);

  const lookTarget = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    timeRef.current = (timeRef.current + delta / 30) % 1; // 30-second loop
    const point = path.getPoint(timeRef.current);
    cameraRef.current.position.copy(point);
    cameraRef.current.lookAt(lookTarget);
  });

  return <perspectiveCamera ref={cameraRef} makeDefault fov={35} near={0.1} far={100} />;
}
```

Consider starting with the spline approach and upgrading to Theater.js later if the choreography needs more polish.

**Step 4: Verify — camera should slowly, smoothly pan around the village in a 30-second loop.**

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add cinematic camera panning across village"
```

---

### Task 9: Mobile Fallback

**Files:**
- Create: `src/components/village/VillageFallback.tsx` (or just conditional in VillageCanvas)
- Create: `public/village/` (pre-rendered static images — placeholder for now)
- Modify: `src/components/village/VillageCanvas.tsx`
- Modify: `src/components/marketing/Hero.astro`

**Step 1: Add device detection**

In `VillageCanvas.tsx`, check for mobile/low-power devices:

```tsx
const isMobile = typeof window !== 'undefined' && (
  window.innerWidth < 768 ||
  /Android|iPhone|iPad/i.test(navigator.userAgent) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
);
```

**Step 2: Create fallback component**

If mobile, render a static image instead of the Three.js canvas:

```tsx
function VillageFallback() {
  const hour = new Date().getHours();
  let variant = 'night';
  if (hour >= 6 && hour < 9) variant = 'dawn';
  else if (hour >= 9 && hour < 17) variant = 'day';
  else if (hour >= 17 && hour < 20) variant = 'dusk';

  return (
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(/get-sidequest/village/${variant}.jpg)` }}
    />
  );
}
```

**Step 3: Create placeholder images**

For now, create 4 placeholder images in `public/village/` (dawn.jpg, day.jpg, dusk.jpg, night.jpg). These will be screenshots from the Three.js scene once it's complete. Use solid color rectangles as temporary placeholders.

**Step 4: Conditionally render in VillageCanvas**

```tsx
export default function VillageCanvas() {
  if (isMobile) return <VillageFallback />;
  return <Canvas>...</Canvas>;
}
```

**Step 5: Verify — resize browser to mobile width, should see fallback image instead of Three.js.**

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add mobile fallback with time-of-day static images"
```

---

### Task 10: Add Pixel Art Icons to Feature Cards

**Files:**
- Copy sprite assets to: `public/sprites/` (building icons)
- Create: `src/components/village/sprites/` (small pixel art building icons as SVGs or PNGs)
- Modify: `src/components/marketing/FeatureCard.astro`
- Modify: `src/components/marketing/Features.astro`

**Step 1: Create or extract small pixel art icons for each feature**

Each feature card gets a 32x32 or 48x48 pixel art icon next to the headline. These could be:
- Simplified versions of the buildings from the 3D scene
- The existing character SVGs from the sidequest app (supervisor robot, chronicler owl, courier cat)
- New simple pixel art icons

For MVP, copy the portrait PNGs and use them as feature icons:
- Quest Board → use a quest/scroll icon
- Supervisor → supervisor.png portrait
- Journals → chronicler.png portrait
- Terminal → workshop/anvil icon
- Usage Dashboard → crystal/potion icon

**Step 2: Update FeatureCard.astro** to accept an optional `icon` prop (image path) and render it inline next to the headline.

**Step 3: Update Features.astro** to pass icon paths to each FeatureCard.

**Step 4: Verify — each feature card shows its pixel art icon, rendered with `image-rendering: pixelated` for crisp scaling.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add pixel art character icons to feature cards"
```

---

### Task 11: Add Floating RPG Items to Download CTA

**Files:**
- Modify: `src/components/marketing/DownloadCTA.astro`
- Create: `public/sprites/items/` (small pixel art item PNGs)

**Step 1: Create or extract pixel art item images**

From the sidequest app's `WelcomeScene.tsx`, the SVG pixel art items (sword, scroll, potion, chest, crystal) can be rendered to small PNGs, or recreated as simple CSS/SVG elements.

For MVP, create simple CSS-animated floating elements — small colored squares/shapes that bob gently using CSS keyframe animations:

```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}
```

**Step 2: Add 3-4 floating pixel art items behind the CTA text** in DownloadCTA.astro. Position them absolutely, low opacity, with staggered animation delays.

**Step 3: Verify — subtle floating items visible behind the download button, not distracting.**

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add floating pixel art items to download CTA section"
```

---

### Task 12: Final Polish and Build Verification

**Step 1: Clean build**

```bash
rm -rf dist node_modules
bun install
bun run build
```

**Step 2: Preview and verify all sections**

```bash
bun run preview
```

Check:
- Three.js village renders in the hero (desktop)
- Mobile fallback works (resize browser)
- Text overlay is readable over the scene
- Camera pans smoothly
- Time-of-day lighting matches your current time
- Post-processing effects (DoF, bloom) look right
- Feature cards have pixel art icons
- Download CTA has floating items
- Docs pages still work at `/docs/`
- Navbar and footer links all function
- No console errors

**Step 3: Performance check**

- Open browser DevTools → Performance tab
- The Three.js scene should run at 60fps on desktop
- No memory leaks (check memory tab over 30 seconds)
- Total page weight should be reasonable (check Network tab)

**Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final polish and verification"
```
