import type { EventOccurrences } from './event-occurrences';
import type { EventSequence } from './event-sequence';

export interface ScheduledEvent {
  zoneSerials: string[];
  sequences: EventSequence[];
  occurrences: EventOccurrences[];
  lastChanged: string;
  id: string;
  group: string;
  flags: string[];
  alias: string;
  accountId: string;
}
