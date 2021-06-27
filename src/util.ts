import normalizeColor from 'color-normalize';
import type { ColorInput } from './types';

const hexColorRegex = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export function socketColorHex(input: ColorInput): string {
  // EverLights via sockets expects colors in GRB format
  return colorHex(input).replace(/hexColorRegex/, '$2$1$3');
}

export function colorHex(input: ColorInput): string {
  // normalizeColor does not handle hex numbers without a `#`, e.g. `ffffff` would come back as `NaNNaNNaNNaNNaNNaN`
  if (typeof input === 'string' && hexColorRegex.test(input)) {
    return input.toUpperCase();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [r, g, b, alpha] = normalizeColor(input);
  const [rHex, gHex, bHex] = [r, g, b].map((c) => hex(Math.round(c * 255)));

  return [rHex, gHex, bHex].join('').toUpperCase();
}

export function hex(number: number): string {
  return number.toString(16).padStart(2, '0');
}
