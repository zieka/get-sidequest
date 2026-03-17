import { CameraRig } from './CameraRig';
import { Backdrop } from './Backdrop';
import { Characters } from './Characters';
import { TimeOfDayLighting } from './TimeOfDayLighting';
import { Particles } from './atmosphere/Particles';
import { Effects } from './Effects';

export function VillageScene() {
  return (
    <>
      <CameraRig />
      <TimeOfDayLighting />
      <Backdrop />
      <Characters />
      <Particles />
      <Effects />
    </>
  );
}
