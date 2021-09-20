import type { ColorInput } from './color';
import type { Effect, EffectOrInput } from './effect';

export interface Program {
  pattern: string[];
  effects: Effect[];
}

export interface ProgramInput {
  pattern: ColorInput[];
  effects?: EffectOrInput[];
}

export type ProgramOrInput = Program | ProgramInput;
