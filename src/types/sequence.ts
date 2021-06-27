import type { Program, ProgramInput } from './program';

export interface Sequence extends Program {
  lastChanged: string;
  id: string;
  groups: string[];
  group?: string; // this seems to be more or less ignored (in favor of `groups`)
  alias: string;
  accountId: string;
}

export interface SequenceInput extends ProgramInput {
  alias: string;
  groups?: string[]; // defaults to [`Personal/`]
  accountId?: string;
}
