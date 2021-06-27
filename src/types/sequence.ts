import type { ColorInput } from './color';
import type { Effect } from './effect';
import type { Program } from './program';

export interface Sequence extends Program {
  lastChanged: string;
  id: string;
  groups: string[];
  group?: string;
  alias: string;
  accountId: string;
}

export interface SequenceInput {
  alias: string;
  pattern: ColorInput[];
  effects?: Effect[];
  groups?: string[]; // defaults to [`Personal/`]
  accountId?: string;
}
