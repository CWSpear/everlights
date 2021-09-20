import type { ColorInput } from './types/color';
import type { EffectOrInput } from './types/effect';
import type { Program, ProgramOrInput } from './types/program';
import type { EverLights } from './v3-sdk';

export class ZoneHelper {
  constructor(private readonly serial: string, private readonly everLights: EverLights) {}

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
