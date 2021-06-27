import type { ColorInput } from './color';
import type { Effect, EffectInput } from './effect';

export interface Program {
  pattern: string[];
  effects: Effect[];
}

export interface ProgramInput {
  pattern: ColorInput[];
  effects?: Effect[] | EffectInput[];
}
