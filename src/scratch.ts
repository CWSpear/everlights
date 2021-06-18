import chalk from 'chalk';
import { EffectType } from './const';
import type { ColorInput, EffectInput, Zone } from './types';
import { EverLights } from './v3-sdk';

const everLights = new EverLights({ host: process.env.EVER_LIGHTS_HOST! });

(async () => {
  // get the first zone (I only have one)
  const [zone]: Zone[] = await everLights.getZones();

  const pattern: ColorInput[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  // effects are optional. some can be combined. currently, there is no input validation
  const effects: EffectInput[] = [
    {
      // enum to helper with the effects
      type: EffectType.Chase,
      // speed value 0-255
      speed: 255,
    },
  ];

  await everLights.startProgram(zone.serial, pattern, effects);

  // alternatively, you can create a "zone helper" sub-SDK to not have to keep passing the serial around
  const zoneHelper = everLights.makeZoneHelper(zone.serial);
  // this is equivalent to the everLights.startProgram above
  await zoneHelper.startProgram(pattern, effects);

  // this will turn all the lights off in the zone
  await everLights.stopProgram(zone.serial);

  // of you can use the zone helper
  await zoneHelper.stopProgram();
})().catch((err) => {
  console.error(chalk.red('Error'), err?.response?.data || err.message);
});
