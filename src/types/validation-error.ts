import type { Effect } from './effect';
import type { Program } from './program';
import type { ScheduledEvent } from './scheduled-event';
import type { Sequence } from './sequence';

type Validatedable = Sequence | Effect | Program | ScheduledEvent;

export interface ValidationError<T extends Validatedable, K extends keyof T = keyof T> {
  message: string;
  field: keyof T;
  children?: T[K] extends Validatedable ? ValidationError<T[K]>[] : never;
}
