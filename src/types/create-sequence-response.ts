import type { ScheduledEvent } from './scheduled-event';

export interface CreateSequenceResponse extends ScheduledEvent {
  _id: string;
}
