import { CameraRig } from './CameraRig';
import { Terrain } from './Terrain';
import { Buildings } from './Buildings';
import { Characters } from './Characters';
import { TimeOfDayLighting } from './TimeOfDayLighting';
import { Atmosphere } from './Atmosphere';
import { Effects } from './Effects';

export function VillageScene() {
  return (
    <>
      <CameraRig />
      <TimeOfDayLighting />
      <Terrain />
      <Buildings />
      <Characters />
      <Atmosphere />
      <Effects />
    </>
  );
}
