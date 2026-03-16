import { Watchtower } from './buildings/Watchtower';
import { Library } from './buildings/Library';
import { CourierPost } from './buildings/CourierPost';
import { Workshop } from './buildings/Workshop';
import { QuestBoard } from './buildings/QuestBoard';

export function Buildings() {
  return (
    <group>
      <Watchtower />
      <Library />
      <CourierPost />
      <Workshop />
      <QuestBoard />
    </group>
  );
}
