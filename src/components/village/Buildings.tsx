import { Watchtower } from './buildings/Watchtower';
import { Library } from './buildings/Library';
import { CourierPost } from './buildings/CourierPost';
import { Workshop } from './buildings/Workshop';
import { QuestBoard } from './buildings/QuestBoard';

export function Buildings() {
  // Rectangular layout — spread wide horizontally (x), shallow depth (z)
  // Buildings arranged in a line/row with slight z variation for depth
  // Offsets compensate for each building's internal hardcoded position
  return (
    <group>
      {/* Watchtower: internal pos (-5,0,-3), target (-8, 0, 0) → offset (-3, 0, 3) */}
      <group position={[-3, 0, 3]}>
        <Watchtower />
      </group>

      {/* Library: internal pos (4,0,-2), target (4, 0, -1) → offset (0, 0, 1) */}
      <group position={[0, 0, 1]}>
        <Library />
      </group>

      {/* CourierPost: internal pos (-4,0,3), target (-3, 0, 1) → offset (1, 0, -2) */}
      <group position={[1, 0, -2]}>
        <CourierPost />
      </group>

      {/* Workshop: internal pos (5,0,2), target (9, 0, 0) → offset (4, 0, -2) */}
      <group position={[4, 0, -2]}>
        <Workshop />
      </group>

      {/* QuestBoard: internal pos (0,0,0.5), target (0, 0, 1) → offset (0, 0, 0.5) */}
      <group position={[0, 0, 0.5]}>
        <QuestBoard />
      </group>
    </group>
  );
}
