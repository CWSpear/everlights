import type { ColorInput } from './types/color';
import type { Effect, EffectInput } from './types/effect';
import type { Program } from './types/program';
import type { EverLights } from './v3-sdk';

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
