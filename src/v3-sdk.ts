import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import type {
  ColorInput,
  Effect,
  EffectInput,
  Options,
  Program,
  ProgramInput,
  ScheduledEvent,
  Sequence,
  SequenceInput,
  Status,
  Zone,
} from './types';
import { colorHex, validate } from './util';
import { programInputSchema, sequenceInputValidation } from './validation';
import { ZoneHelper } from './zone-helper';

export class EverLights {
  static isEffect(effectOrInputEffect: EffectInput | Effect): effectOrInputEffect is Effect {
    return 'effectType' in effectOrInputEffect;
  }

  static normalizePattern(color: ColorInput): string {
    return colorHex(color);
  }

  static normalizePatterns(colors: ColorInput[]): string[] {
    return colors.map((color) => EverLights.normalizePattern(color));
  }

  static normalizeEffect(effect: EffectInput | Effect): Effect {
    if (EverLights.isEffect(effect)) {
      return effect;
    }

    return {
      effectType: effect.type,
      value: effect.speed,
    };
  }

  static normalizeEffects(effects: EffectInput[] | Effect[]): Effect[] {
    return effects.map((effect) => EverLights.normalizeEffect(effect));
  }

  static normalizeSequence(sequenceId: string, sequence: SequenceInput | Sequence): Sequence {
    const groups = sequence.groups ? EverLights.normalizeGroupNames(sequence.groups) : ['Personal/'];
    return {
      ...sequence,
      id: sequenceId,
      pattern: EverLights.normalizePatterns(sequence.pattern),
      effects: sequence.effects ? EverLights.normalizeEffects(sequence.effects) : [],
      accountId: sequence.accountId ?? undefined!,
      lastChanged: new Date().toISOString(),
      group: groups[0], // this field appears to have no real effect
      groups,
    };
  }

  static normalizeGroupName(group: string): string {
    if (group.toLowerCase() === 'personal' || group === '/') {
      return 'Personal/';
    }

    return group.replace(/^\/*(?:Personal\/$)?(.*?)\/*$/i, 'Personal/$1/');
  }

  static normalizeGroupNames(groups: string[]): string[] {
    return groups.map((group) => EverLights.normalizeGroupName(group));
  }

  public readonly api: AxiosInstance = axios.create({
    baseURL: `http://${this.options.host}/v1`,
    headers: {
      Accept: 'application/json',
    },
  });

  constructor(private readonly options: Options) {}

  makeZoneHelper(zoneSerial: string): ZoneHelper {
    return new ZoneHelper(zoneSerial, this);
  }

  async getStatus(): Promise<Readonly<Status>> {
    return (await this.api.get<Status>('')).data;
  }

  async getHeartbeat(): Promise<Readonly<null>> {
    return (await this.api.get<null>('available')).data;
  }

  async getZones(): Promise<Readonly<Zone>[]> {
    return (await this.api.get<Zone[]>('zones')).data;
  }

  async getZone(zoneSerial: string): Promise<Readonly<Zone>[]> {
    return (await this.api.get<Zone[]>(`zones/${zoneSerial}`)).data;
  }

  async getProgram(zoneSerial: string): Promise<Readonly<Program>> {
    return (await this.api.get<Program>(`zones/${zoneSerial}/sequence`)).data;
  }

  async startProgram(zoneSerial: string, pattern: ColorInput[], effects: EffectInput[] | Effect[] = []): Promise<Readonly<Program>> {
    const input: ProgramInput = {
      pattern,
      effects,
    };

    console.log(input);
    const validValue = validate(programInputSchema, input);

    const payload: Program = {
      pattern: EverLights.normalizePatterns(validValue.pattern),
      effects: EverLights.normalizeEffects(validValue.effects),
    };

    return (await this.api.post<Program>(`zones/${zoneSerial}/sequence`, payload)).data;
  }

  async stopProgram(zoneSerial: string): Promise<void> {
    await this.api.delete<void>(`zones/${zoneSerial}/sequence`);
  }

  async getSequences(): Promise<Sequence[]> {
    return (await this.api.get<Sequence[]>(`sequences`)).data;
  }

  async getSequence(sequenceId: string): Promise<Readonly<Sequence>> {
    return (await this.api.get<Sequence>(`sequences/${sequenceId}`)).data;
  }

  async createSequence(sequence: Sequence | SequenceInput): Promise<Readonly<Sequence>> {
    const validValue = validate(sequenceInputValidation, sequence);

    const payload: Sequence = EverLights.normalizeSequence(uuid(), validValue);
    return (await this.api.post<Sequence>(`sequences`, payload)).data;
  }

  async updateSequence(sequenceId: string, sequence: Sequence | SequenceInput): Promise<Readonly<Sequence>> {
    const validValue = validate(sequenceInputValidation, sequence);

    const payload: Sequence = EverLights.normalizeSequence(sequenceId, validValue);
    return (await this.api.put<Sequence>(`sequences/${sequenceId}`, payload)).data;
  }

  async deleteSequence(sequenceId: string): Promise<void> {
    await this.api.delete<void>(`sequences/${sequenceId}`);
  }

  async getEvents(): Promise<Readonly<ScheduledEvent>[]> {
    return (await this.api.get<ScheduledEvent[]>(`events`)).data;
  }

  async getEvent(eventId: string): Promise<Readonly<ScheduledEvent>> {
    return (await this.api.get<ScheduledEvent>(`events/${eventId}`)).data;
  }

  async createEvent(eventId: string, event: ScheduledEvent): Promise<Readonly<ScheduledEvent>> {
    return (await this.api.post<ScheduledEvent>(`events/${eventId}`, event)).data;
  }

  async updateEvent(eventId: string, event: ScheduledEvent): Promise<Readonly<ScheduledEvent>> {
    return (await this.api.put<ScheduledEvent>(`events/${eventId}`, event)).data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.api.delete<void>(`events/${eventId}`);
  }

  async updateTime(time: string): Promise<void> {
    return (await this.api.put<void>(`time`, { time })).data;
  }
}
