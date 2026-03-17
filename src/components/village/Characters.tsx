import { CharacterSprite } from './sprites/CharacterSprite';

export function Characters() {
  const base = '/get-sidequest/';

  return (
    <group>
      {/* Supervisor Robot - near the watchtower */}
      <CharacterSprite
        texturePath={`${base}sprites/supervisor.png`}
        position={[-7, 1.2, 1]}
        scale={1.2}
        bobSpeed={1.2}
        bobAmount={0.03}
      />

      {/* Chronicler Owl - near the library */}
      <CharacterSprite
        texturePath={`${base}sprites/chronicler.png`}
        position={[3, 1.2, 0]}
        scale={1.4}
        bobSpeed={1.8}
        bobAmount={0.04}
      />

      {/* Courier Cat - on the path between buildings */}
      <CharacterSprite
        texturePath={`${base}sprites/courier.png`}
        position={[-1, 1.2, 1.5]}
        scale={1.3}
        bobSpeed={2.0}
        bobAmount={0.06}
      />
    </group>
  );
}
