import type { Effect } from './effect';

export interface Program {
  pattern: string[];
  effects: Effect[];
}
