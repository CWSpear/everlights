import type { ColorInput } from './types';

const normalizeColor = require('color-normalize');

export function socketColorHex(input: ColorInput): string {
  // EverLights via sockets expects colors in GRB format
  return colorHex(input).replace(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i, '$2$1$3');
}

export function colorHex(input: ColorInput): string {
  const [r, g, b, alpha] = normalizeColor(input);
  const [rHex, gHex, bHex] = [r, g, b].map((c) => hex(Math.round(c * 255)));

  return [rHex, gHex, bHex].join('');
}

export function hex(number: number): string {
  return number.toString(16).padStart(2, '0');
}
