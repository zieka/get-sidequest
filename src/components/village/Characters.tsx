import { CharacterSprite } from './sprites/CharacterSprite';

export function Characters() {
  const base = '/get-sidequest/';

  // Characters scaled to match the tiny figures already in the background art.
  // Positioned on the streets/dock area of the harbor town.
  // Backdrop is at z=-5, scale [64, 35]. Street level is around y=-6 to -7.
  return (
    <group>
      {/* Supervisor Robot - on the cobblestone street, left of center */}
      <CharacterSprite
        texturePath={`${base}sprites/supervisor.png`}
        position={[-1.5, -6.2, -4]}
        scale={0.25}
        bobSpeed={1.2}
        bobAmount={0.005}
      />

      {/* Chronicler Owl - near the market stalls area */}
      <CharacterSprite
        texturePath={`${base}sprites/chronicler.png`}
        position={[0.8, -6.0, -3.8]}
        scale={0.22}
        bobSpeed={1.8}
        bobAmount={0.005}
      />

      {/* Courier Cat - on the dock/waterfront path */}
      <CharacterSprite
        texturePath={`${base}sprites/courier.png`}
        position={[2.5, -6.5, -3.5]}
        scale={0.23}
        bobSpeed={2.0}
        bobAmount={0.005}
      />
    </group>
  );
}
