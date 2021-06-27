import { EffectType } from './const/effect-type';
import type { Effect } from './types/effect';
import type { Sequence } from './types/sequence';
import { prettyDeepPrint } from './util';
import { effectSchema, sequenceValidation } from './validation';

describe('validation', () => {
  describe('Effects', () => {
    const validEffectSpeed = 255;
    const validEffectType = EffectType.Blink;

    it('should only allow numbers between 0-255 inclusive', () => {
      const effect1: Effect = {
        effectType: validEffectType,
        value: -1,
      };
      prettyDeepPrint(effectSchema.validate(effect1));
      const effect2: Effect = {
        effectType: validEffectType,
        value: 256,
      };
      prettyDeepPrint(effectSchema.validate(effect2));
      const effect3: Effect = {
        effectType: validEffectType,
        value: validEffectSpeed,
      };
      prettyDeepPrint(effectSchema.validate(effect3));
      const effect4: Effect = {
        effectType: validEffectType,
        value: undefined!,
      };
      prettyDeepPrint(effectSchema.validate(effect4));
    });
  });

  describe('Sequence', () => {
    it('should validate', () => {
      const sequence: Sequence = <Sequence>{
        effects: [
          {
            value: 256,
            effectType: EffectType.Blink,
          },
          {
            value: 256,
          },
        ],
      };
      prettyDeepPrint(sequenceValidation.validate(sequence));
    });
  });
});
