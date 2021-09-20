import type { Schema } from 'joi';
import * as Joi from 'joi';
import { EffectType } from './const';
import type {
  Effect,
  EffectInput,
  HSLColor,
  HueSaturationLightnessColor,
  Program,
  ProgramInput,
  RedGreenBlueColor,
  RGBColor,
  Sequence,
} from './types';
import { hexColorRegex } from './util';

export const colorSchema = Joi.string().pattern(hexColorRegex);

export const patternsSchema = Joi.array().items(colorSchema).required().min(1);

const sharedEffectValidationDefinition: Record<keyof EffectInput, Schema> = {
  speed: Joi.number().min(0).max(255).default(255),
  type: Joi.string()
    .required()
    .valid(...Object.values(EffectType)),
};

export const effectSchema = Joi.object<Effect>({
  value: sharedEffectValidationDefinition.speed,
  effectType: sharedEffectValidationDefinition.type,
});

export const effectInputSchema = Joi.object<EffectInput>({
  ...sharedEffectValidationDefinition,
});

export const effectsSchema = Joi.array().optional().items(effectSchema).default([]);

export const effectInputsSchema = Joi.array().optional().items(effectInputSchema).default([]);

export const effectsOrEffectInputsSchema = Joi.array().items(Joi.alternatives().try(effectInputSchema, effectSchema));

export const patternInputSchema = Joi.alternatives()
  .required()
  .try(
    colorSchema,
    Joi.string(),
    Joi.number(),
    Joi.array().min(3).max(4).items(Joi.number()), // TODO float 0-1 or integer 0-255?
    Joi.object<RGBColor>({
      r: Joi.number().required(),
      g: Joi.number().required(),
      b: Joi.number().required(),
    }),
    Joi.object<RedGreenBlueColor>({
      red: Joi.number().required(),
      green: Joi.number().required(),
      blue: Joi.number().required(),
    }),
    Joi.object<HSLColor>({
      h: Joi.number().required(),
      s: Joi.number().required(),
      l: Joi.number().required(),
    }),
    Joi.object<HueSaturationLightnessColor>({
      hue: Joi.number().required(),
      saturation: Joi.number().required(),
      lightness: Joi.number().required(),
    }),
  );

export const patternInputsSchema = Joi.array().items(patternInputSchema);

export const programSchema = Joi.object<Program>({
  pattern: patternsSchema,
  effects: effectsSchema,
});

export const programInputSchema = Joi.object<ProgramInput>({
  pattern: patternInputsSchema,
  effects: effectsOrEffectInputsSchema,
});

const sharedSequenceValidationDefinition: Record<keyof Sequence, Schema> = {
  id: Joi.string().uuid(),
  alias: Joi.string().required(),
  pattern: patternsSchema,
  effects: effectsSchema,
  accountId: Joi.string().uuid(),
  lastChanged: Joi.string().isoDate(),
  groups: Joi.array()
    .items(Joi.string().pattern(/([a-zA-Z0-9 -_]+\/){1,2}/))
    .min(1)
    .default(['Personal/']),
  group: Joi.string(),
};

export const sequenceValidation = Joi.object<Sequence>({
  ...sharedSequenceValidationDefinition,
  id: sharedSequenceValidationDefinition.id.required(),
  effects: sharedSequenceValidationDefinition.effects.required(),
  // accountId: sharedSequenceValidationDefinition.accountId.required(), // these really aren't required...
  // lastChanged: sharedSequenceValidationDefinition.lastChanged.required(), // these really aren't required...
});

export const sequenceInputValidation = Joi.object<Sequence>({
  ...sharedSequenceValidationDefinition,
  pattern: patternInputsSchema,
  effects: effectsOrEffectInputsSchema,
});
