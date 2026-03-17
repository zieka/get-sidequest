import { CharacterSprite } from './sprites/CharacterSprite';

export function Characters() {
  const base = '/get-sidequest/';

  // Characters positioned in front of the backdrop (z > -5)
  // Spread horizontally across the scene, at the "ground level" of the image
  return (
    <group>
      {/* Supervisor Robot - left side of scene */}
      <CharacterSprite
        texturePath={`${base}sprites/supervisor.png`}
        position={[-2.5, -1.5, -2]}
        scale={1.0}
        bobSpeed={1.2}
        bobAmount={0.02}
      />

      {/* Chronicler Owl - center-right */}
      <CharacterSprite
        texturePath={`${base}sprites/chronicler.png`}
        position={[1.5, -1.8, -1]}
        scale={1.1}
        bobSpeed={1.8}
        bobAmount={0.02}
      />

      {/* Courier Cat - right side, slightly forward */}
      <CharacterSprite
        texturePath={`${base}sprites/courier.png`}
        position={[3.5, -1.6, 0]}
        scale={1.0}
        bobSpeed={2.0}
        bobAmount={0.03}
      />
    </group>
  );
}
