import { CharacterSprite } from './sprites/CharacterSprite';

export function Characters() {
  // Use the base URL for asset paths in production
  const base = '/get-sidequest/';

  return (
    <group>
      {/* Supervisor Robot - on the watchtower balcony */}
      <CharacterSprite
        texturePath={`${base}sprites/supervisor.png`}
        position={[-5, 4.2, -2.2]}
        scale={1.2}
        bobSpeed={1.2}
        bobAmount={0.03}
      />

      {/* Chronicler Owl - near the library entrance */}
      <CharacterSprite
        texturePath={`${base}sprites/chronicler.png`}
        position={[3, 1.2, -0.5]}
        scale={1.4}
        bobSpeed={1.8}
        bobAmount={0.04}
      />

      {/* Courier Cat - on the dirt path, walking */}
      <CharacterSprite
        texturePath={`${base}sprites/courier.png`}
        position={[0, 1.2, 2]}
        scale={1.3}
        bobSpeed={2.0}
        bobAmount={0.06}
      />
    </group>
  );
}
