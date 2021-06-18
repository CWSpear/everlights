import type { ColorInput } from '../util';
import type { Program } from './program';

export interface Sequence extends Program {
  lastChanged: string;
  id: string;
  groups: string[];
  group?: string;
  alias: string;
  accountId: string;
}

export interface SequenceInput extends Omit<Sequence, 'pattern'> {
  pattern: ColorInput[];
}
