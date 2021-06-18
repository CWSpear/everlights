import axios, { AxiosInstance } from 'axios';
import type { Program, ScheduledEvent, Sequence, Status, Zone, Effect, ColorInput } from './types';
import { EffectInput, Options } from './types';
import { colorHex } from './util';

export class EverLights {
  public readonly api: AxiosInstance;

  constructor(private readonly options: Options) {
    this.api = axios.create({
      baseURL: `http://${this.options.host}/v1`,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  makeZoneHelper(zoneSerial: string): ZoneHelper {
    return new ZoneHelper(zoneSerial, this);
  }

  async getStatus(): Promise<Status> {
    return (await this.api.get<Status>('')).data;
  }

  async getHeartbeat(): Promise<null> {
    return (await this.api.get<null>('available')).data;
  }

  async getZones(): Promise<Zone[]> {
    return (await this.api.get<Zone[]>('zones')).data;
  }

  async getZone(zoneSerial: string): Promise<Zone[]> {
    return (await this.api.get<Zone[]>(`zones/${zoneSerial}`)).data;
  }

  async getProgram(zoneSerial: string): Promise<Program> {
    return (await this.api.get<Program>(`zones/${zoneSerial}/sequence`)).data;
  }

  async startProgram(zoneSerial: string, pattern: ColorInput[], effects: EffectInput[] | Effect[] = []): Promise<Program> {
    const payload: Program = {
      pattern: this.normalizePatternInput(pattern),
      effects: this.normalizeEffectInput(effects),
    };
    return (await this.api.post<Program>(`zones/${zoneSerial}/sequence`, payload)).data;
  }

  async stopProgram(zoneSerial: string): Promise<void> {
    await this.api.delete<void>(`zones/${zoneSerial}/sequence`);
  }

  async getSequences(): Promise<Sequence[]> {
    return (await this.api.get<Sequence[]>(`sequences`)).data;
  }

  async getSequence(sequenceId: string): Promise<Sequence> {
    return (await this.api.get<Sequence>(`sequences/${sequenceId}`)).data;
  }

  async createSequence(sequenceId: string, sequence: Sequence): Promise<Sequence> {
    return (await this.api.post<Sequence>(`sequences/${sequenceId}`, sequence)).data;
  }

  async updateSequence(sequenceId: string, sequence: Sequence): Promise<Sequence> {
    return (await this.api.put<Sequence>(`sequences/${sequenceId}`, sequence)).data;
  }

  async deleteSequence(sequenceId: string): Promise<void> {
    await this.api.delete<void>(`sequences/${sequenceId}`);
  }

  async getEvents(): Promise<ScheduledEvent[]> {
    return (await this.api.get<ScheduledEvent[]>(`events`)).data;
  }

  async getEvent(eventId: string): Promise<ScheduledEvent> {
    return (await this.api.get<ScheduledEvent>(`events/${eventId}`)).data;
  }

  async createEvent(eventId: string, event: ScheduledEvent): Promise<ScheduledEvent> {
    return (await this.api.post<ScheduledEvent>(`events/${eventId}`, event)).data;
  }

  async updateEvent(eventId: string, event: ScheduledEvent): Promise<ScheduledEvent> {
    return (await this.api.put<ScheduledEvent>(`events/${eventId}`, event)).data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.api.delete<void>(`events/${eventId}`);
  }

  async updateTime(time: string): Promise<void> {
    return (await this.api.put<void>(`time`, { time })).data;
  }

  private normalizePatternInput(input: ColorInput[]): string[] {
    return input.map((color) => colorHex(color));
  }

  private normalizeEffectInput(input: EffectInput[] | Effect[]): Effect[] {
    return input.map((effect) => {
      if (this.isEffect(effect)) {
        return effect;
      }

      return {
        effectType: effect.type,
        value: effect.speed,
      };
    });
  }

  private isEffect(effectOrInputEffect: EffectInput | Effect): effectOrInputEffect is Effect {
    return 'effectType' in effectOrInputEffect;
  }
}

export class ZoneHelper {
  constructor(private readonly serial: string, private readonly everLights: EverLights) {}

  async getProgram(): Promise<Program> {
    return this.everLights.getProgram(this.serial);
  }

  async startProgram(pattern: ColorInput[], effects: EffectInput[] | Effect[] = []): Promise<Program> {
    return this.everLights.startProgram(this.serial, pattern, effects);
  }

  async stopProgram(): Promise<void> {
    return this.everLights.stopProgram(this.serial);
  }
}
