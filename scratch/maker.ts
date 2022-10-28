import { compact, isEqual } from 'lodash';
import { EffectType } from '../src/const';
import type { ColorInput, Effect, EffectOrInput, Sequence, Zone } from '../src/types';
import { EverLights } from '../src/v3-sdk';
import type { ZoneHelper } from '../src/zone-helper';
import { makeChasePattern } from './util';

(async () => {
  const everLights = new EverLights({ host: process.env.EVER_LIGHTS_HOST! });
  const [zone]: Zone[] = await everLights.getZones();
  const zoneHelper: ZoneHelper = everLights.makeZoneHelper(zone.serial);

  const updateTracker: boolean[] = [];
  updateTracker.push(await makeChristmasComets(everLights));
  updateTracker.push(await makeChristmasCometsAlt(everLights));

  console.log(`${updateTracker.length} patterns tracked; ${compact(updateTracker).length} needed updating.`);
})().catch((err) => {
  console.error('General Error', err);
});

async function makeChristmasComets(everLights: EverLights): Promise<boolean> {
  const sequence: Sequence = await getOrMake('Christmas Comets', everLights);

  const pattern: ColorInput[] = [...makeChasePattern('red', 14, 6), ...makeChasePattern('green', 14, 6)];
  const effects: EffectOrInput[] = [{ speed: 255, type: EffectType.ReverseChase }];

  return await updateIfDifferent(everLights, sequence, pattern, effects);
}

async function makeChristmasCometsAlt(everLights: EverLights): Promise<boolean> {
  const sequence: Sequence = await getOrMake('Christmas Comets Alt', everLights);

  const pattern: ColorInput[] = EverLights.normalizePattern([
    ...makeChasePattern('red', 14, 6),
    ...makeChasePattern('green', 14, 6),
    ...makeChasePattern('white', 14, 6),
  ]);
  const effects: EffectOrInput[] = EverLights.normalizeEffects([{ speed: 255, type: EffectType.ReverseChase }]);

  return await updateIfDifferent(everLights, sequence, pattern, effects);
}

let sequenceCache: Sequence[] = [];

async function getOrMake(name: string, everLights: EverLights): Promise<Sequence> {
  if (sequenceCache.length === 0) {
    sequenceCache = await everLights.getSequences();
  }
  let targetSequence: Sequence | undefined = sequenceCache.find((sequence) => sequence.alias === name);

  if (!targetSequence) {
    targetSequence = await everLights.createSequence({
      alias: name,
      pattern: ['#bada55'],
    });

    console.log(`Created name because it did not exist.`);
  }

  return targetSequence;
}

async function updateIfDifferent(
  everLights: EverLights,
  sequence: Sequence,
  pattern: ColorInput[],
  effects: EffectOrInput[],
): Promise<boolean> {
  const normalizedPattern: string[] = EverLights.normalizePattern(pattern);
  const normalizedEffects: Effect[] = EverLights.normalizeEffects(effects);

  if (isEqual(sequence.pattern, normalizedPattern) && isEqual(sequence.effects, normalizedEffects)) {
    return false;
  }

  await everLights.updateSequence(sequence.id, {
    ...sequence,
    pattern: normalizedPattern,
    effects: normalizedEffects,
  });

  console.log(`Updated ${sequence.alias}.`);

  return true;
}
