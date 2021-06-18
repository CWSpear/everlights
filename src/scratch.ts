import chalk from 'chalk';
import type { Sequence, Zone } from './types';
import { EverLights } from './v3-sdk';

const everLights = new EverLights({ host: process.env.EVER_LIGHTS_HOST! });

(async () => {
  const sequenceName: string = 'Burning Comet';

  const [zone]: Zone[] = await everLights.getZones();
  const zoneHelper = everLights.makeZoneHelper(zone.serial);

  // I really like the comet effect
  const sequences: Sequence[] = await everLights.getSequences();
  const cometSequence = sequences.find((sequence) => sequence.alias === sequenceName);

  if (cometSequence) {
    await zoneHelper.startProgram(cometSequence.pattern, cometSequence.effects);
  } else {
    throw new Error(`Could not find ${sequenceName} Sequence`);
  }

  console.log(await zoneHelper.getProgram());

  setTimeout(async () => {
    await zoneHelper.stopProgram();
  }, 30000);
})().catch((err) => {
  console.error(chalk.red('Error'), err?.response?.data || err.message);
});
