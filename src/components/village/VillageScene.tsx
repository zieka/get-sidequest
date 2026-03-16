import { Terrain } from './Terrain';
import { Buildings } from './Buildings';
import { TimeOfDayLighting } from './TimeOfDayLighting';

export function VillageScene() {
  return (
    <>
      <TimeOfDayLighting />
      <Terrain />
      <Buildings />
    </>
  );
}
