import { CharacterSprite } from './sprites/CharacterSprite';

export function Characters() {
  const base = '/get-sidequest/';

  // Characters need to be in the visible area of the viewport.
  // Camera is at z=10, looking at z=0. Backdrop at z=-5.
  // Characters at z=-4 (just in front of backdrop).
  // y=0 is center of screen. Positive y = up, negative y = down.
  // Place them in the mid-lower area where the streets are visible.
  return (
    <group>
      {/* Supervisor Robot */}
      <CharacterSprite
        texturePath={`${base}sprites/supervisor.png`}
        position={[-2, -1.5, -4]}
        scale={0.4}
        bobSpeed={1.2}
        bobAmount={0.005}
      />

      {/* Chronicler Owl */}
      <CharacterSprite
        texturePath={`${base}sprites/chronicler.png`}
        position={[0.5, -1.2, -3.8]}
        scale={0.35}
        bobSpeed={1.8}
        bobAmount={0.005}
      />

      {/* Courier Cat */}
      <CharacterSprite
        texturePath={`${base}sprites/courier.png`}
        position={[2.5, -1.8, -3.5]}
        scale={0.38}
        bobSpeed={2.0}
        bobAmount={0.005}
      />
    </group>
  );
}
