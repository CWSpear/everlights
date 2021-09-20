import chalk from 'chalk';
import { EffectType } from './const/effect-type';
import type { ColorInput, Sequence, SequenceInput, Zone } from './types';
import { colorRGB } from './util';
import { EverLights } from './v3-sdk';

const everLights = new EverLights({ host: process.env.EVER_LIGHTS_HOST! });

(async () => {
  const sequenceName: string = 'America';

  const [zone]: Zone[] = await everLights.getZones();
  const zoneHelper = everLights.makeZoneHelper(zone.serial);

  // I really like the comet effect
  const sequences: Sequence[] = await everLights.getSequences();
  const everLightSampleSequence = sequences.find((sequence) => sequence.alias === sequenceName);

  const twins1Name = `Twins' Birthday Chase`;
  let twins1Sequence: Sequence | undefined = sequences.find((sequence) => sequence.alias === twins1Name);

  if (!twins1Sequence) {
    twins1Sequence = await everLights.createSequence({
      alias: twins1Name,
      pattern: ['#bada55'],
    });

    console.log(`${chalk.magenta(twins1Name)} already existed`);
  }

  twins1Sequence = await everLights.updateSequence(twins1Sequence.id, {
    ...twins1Sequence,
    // accountId: 'd50a1fca-cedb-49da-a75e-835cd2f28950',
    pattern: [...makeChasePattern('red', 14, 6), ...makeChasePattern('blue', 14, 6)],
    effects: [{ speed: 255, type: EffectType.ReverseChase }],
  });

  const twins2Name = `Twins' Birthday Twinkle`;
  let twins2Sequence: Sequence | undefined = sequences.find((sequence) => sequence.alias === twins2Name);

  if (!twins2Sequence) {
    twins2Sequence = await everLights.createSequence({
      alias: twins2Name,
      pattern: ['#bada55'],
    });

    console.log(`${chalk.magenta(twins2Name)} already existed`);
  }

  twins2Sequence = await everLights.updateSequence(twins2Sequence.id, {
    ...twins2Sequence,
    // accountId: 'd50a1fca-cedb-49da-a75e-835cd2f28950',
    pattern: [...makeGradient('#330000', '#000033', 7), ...makeGradient('#000033', '#330000', 7)],
    effects: [{ type: EffectType.Twinkle, speed: 255 }],
  });

  const rainbowTestName = `Rainbow Test`;
  let rainbowTestSequence: Sequence | undefined = sequences.find((sequence) => sequence.alias === rainbowTestName);

  if (!rainbowTestSequence) {
    rainbowTestSequence = await everLights.createSequence({
      alias: rainbowTestName,
      pattern: ['#bada55'],
    });

    console.log(`${chalk.magenta(rainbowTestName)} already existed`);
  }

  rainbowTestSequence = await everLights.updateSequence(rainbowTestSequence.id, {
    ...rainbowTestSequence,
    // accountId: 'd50a1fca-cedb-49da-a75e-835cd2f28950',
    pattern: [
      ...makeGradient('red', 'orange', 10),
      ...makeGradient('orange', 'yellow', 10),
      ...makeGradient('yellow', 'green', 10),
      ...makeGradient('green', 'blue', 10),
      ...makeGradient('blue', 'purple', 10),
      ...makeGradient('purple', 'red', 10),
    ],
    // effects: [{ type: EffectType.Chase, speed: 255 }],
    effects: [],
  });

  // console.log(twins1Sequence);
  // console.log(twins2Sequence);
  // console.log(rainbowTestSequence);

  const toDelete: string[] = ['Test', 'Fire', 'Created Programmatically', `Rachelle's Birthday`];
  await Promise.all(
    toDelete.map(async (alias) => {
      const seq = sequences.find((s) => s.alias === alias);
      if (seq) {
        await everLights.deleteSequence(seq.id);
        console.log(`${chalk.red('Deleted')} ${chalk.magenta(alias)}`);
      }
    }),
  );

  // await zoneHelper.startProgram(twins2Sequence);
  // await zoneHelper.stopProgram();

  await cycleSequences([twins1Sequence, twins2Sequence], 7 * 4);

  console.log(chalk.yellow('Gracefully exiting cuz it is late, yo'));

  async function cycleSequences(sequences: (Sequence | SequenceInput)[], timeLimit: number = 60, internalCounter = 0) {
    const seq = sequences[internalCounter % sequences.length];
    console.log(`${chalk.blue('Cycling to')} ${chalk.magenta(seq.alias)}`);
    await zoneHelper.startProgram(seq);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), timeLimit * 1000));

    // turn off if it's between 1am and 4pm
    if (1 <= new Date().getHours() && new Date().getHours() < 16) {
      await zoneHelper.stopProgram();
    } else {
      await cycleSequences(sequences, timeLimit, ++internalCounter);
    }
  }
})().catch((err) => {
  console.error(chalk.red('Error'), err?.response?.data || err.message);
  console.error(err?.stack);
});

function makeChasePattern(baseColor: ColorInput, steps: number = 5, gap: number = 5): ColorInput[] {
  const blacks = Array(gap).fill('black', 0);
  const fadingColors = makeGradient(baseColor, 'black', steps, false);
  return [...fadingColors, ...blacks];
}

function makeGradient(start: ColorInput, end: ColorInput, steps: number, inclusive = true): ColorInput[] {
  const inclusiveOffset = inclusive ? 1 : 0;

  const gradient: ColorInput[] = [];
  const { r: r1, g: g1, b: b1 } = colorRGB(start);
  const { r: r2, g: g2, b: b2 } = colorRGB(end);

  const rStep = (r1 - r2) / (steps - inclusiveOffset);
  const gStep = (g1 - g2) / (steps - inclusiveOffset);
  const bStep = (b1 - b2) / (steps - inclusiveOffset);

  for (let step = 0; step < steps - inclusiveOffset; step++) {
    gradient.push([r1 - rStep * step, g1 - gStep * step, b1 - bStep * step]);
  }

  if (inclusive) {
    gradient.push(end);
  }

  return gradient;
}
