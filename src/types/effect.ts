import type { EffectType } from '../const';

export interface Effect {
  value: number; // speed 0-255
  effectType: EffectType;
}

export interface EffectInput {
  speed: number; // speed 0-255
  type: EffectType;
}
