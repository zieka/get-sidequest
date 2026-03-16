import { Terrain } from './Terrain';
import { Buildings } from './Buildings';
import { Characters } from './Characters';
import { TimeOfDayLighting } from './TimeOfDayLighting';
import { Effects } from './Effects';

export function VillageScene() {
  return (
    <>
      <TimeOfDayLighting />
      <Terrain />
      <Buildings />
      <Characters />
      <Effects />
    </>
  );
}
