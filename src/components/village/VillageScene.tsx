import { CameraRig } from './CameraRig';
import { Backdrop } from './Backdrop';
import { Terrain } from './Terrain';
import { Buildings } from './Buildings';
import { Characters } from './Characters';
import { ForegroundElements } from './ForegroundElements';
import { TimeOfDayLighting } from './TimeOfDayLighting';
import { Atmosphere } from './Atmosphere';
import { Effects } from './Effects';

export function VillageScene() {
  return (
    <>
      <CameraRig />
      <TimeOfDayLighting />
      <Backdrop />
      <Terrain />
      <Buildings />
      <Characters />
      <ForegroundElements />
      <Atmosphere />
      <Effects />
    </>
  );
}
