import type { ColorInput } from './types/color';
import type { EffectOrInput } from './types/effect';
import type { Program, ProgramOrInput } from './types/program';
import { Zone } from './types/zone';
import type { EverLights } from './v3-sdk';

export class ZoneHelper {
  constructor(private readonly serial: string, private readonly everLights: EverLights) {}

  async getInfo(): Promise<Readonly<Zone>> {
    return this.everLights.getZone(this.serial);
  }

  async getProgram(): Promise<Program> {
    return this.everLights.getProgram(this.serial);
  }

  async startProgram(pattern: ProgramOrInput): Promise<Readonly<Program>>;
  async startProgram(pattern: ColorInput[], effects?: EffectOrInput[]): Promise<Readonly<Program>>;
  async startProgram(
    patternOrProgram: ProgramOrInput | ColorInput[],
    effects?: EffectOrInput[],
  ): Promise<Readonly<Program>>;
  async startProgram(
    patternOrProgram: ProgramOrInput | ColorInput[],
    effects: EffectOrInput[] = [],
  ): Promise<Readonly<Program>> {
    return this.everLights.startProgram(this.serial, patternOrProgram, effects);
  }

  async stopProgram(): Promise<void> {
    return this.everLights.stopProgram(this.serial);
  }
}
