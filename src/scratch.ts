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

  const newSequenceName = 'Created Programmatically';
  const newSequence = sequences.find((sequence) => sequence.alias === newSequenceName);

  if (!newSequence) {
    const sequence = await everLights.createSequence({
      alias: newSequenceName,
      pattern: ['#bada55'],
    });

    console.log(sequence);
  } else {
    console.log(
      `${chalk.magenta(newSequenceName)} already existed`,
      newSequence,
      // await everLights.updateSequence(newSequence.id, {
      //   ...newSequence,
      //   accountId: 'd50a1fca-cedb-49da-a75e-835cd2f28950',
      //   pattern: ['#bada55', '#cadbad'],
      //   group: 'Cool Group/',
      //   groups: ['Cool Group', 'Another Group', 'Personal'],
      // }),
    );
  }

  if (cometSequence) {
    await zoneHelper.startProgram(cometSequence.pattern, cometSequence.effects);
  } else {
    throw new Error(`Could not find ${sequenceName} Sequence`);
  }

  // console.log(await zoneHelper.getProgram());

  setTimeout(async () => {
    await zoneHelper.stopProgram();
  }, 3000);
})().catch((err) => {
  console.error(chalk.red('Error'), err?.response?.data || err.message);
  console.error(err?.stack);
});
