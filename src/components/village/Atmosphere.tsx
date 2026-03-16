import { Particles } from './atmosphere/Particles';
import { ChimneySmoke } from './atmosphere/ChimneySmoke';
import { Trees } from './atmosphere/Trees';

export function Atmosphere() {
  return (
    <group>
      <Particles />
      <ChimneySmoke />
      <Trees />
    </group>
  );
}
