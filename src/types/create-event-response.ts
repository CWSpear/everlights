import type { ScheduledEvent } from './scheduled-event';

export interface CreateEventResponse extends ScheduledEvent {
  _id: string;
}
