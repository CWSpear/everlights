import { ColorInput } from '../src/types/index';
import { colorRGB } from '../src/util';

export function makeChasePattern(baseColor: ColorInput, steps: number = 5, gap: number = 5): ColorInput[] {
  const blacks = Array(gap).fill('black', 0);
  const fadingColors = makeGradient(baseColor, 'black', steps, false);
  return [...fadingColors, ...blacks];
}

export function makeGradient(start: ColorInput, end: ColorInput, steps: number, inclusive = true): ColorInput[] {
  const inclusiveOffset = inclusive ? 1 : 0;

  const gradient: ColorInput[] = [];
  const { r: r1, g: g1, b: b1 } = colorRGB(start);
  const { r: r2, g: g2, b: b2 } = colorRGB(end);

  const rStep = (r1 - r2) / (steps - inclusiveOffset);
  const gStep = (g1 - g2) / (steps - inclusiveOffset);
  const bStep = (b1 - b2) / (steps - inclusiveOffset);

  for (let step = 0; step < steps - inclusiveOffset; step++) {
    gradient.push([r1 - rStep * step, g1 - gStep * step, b1 - bStep * step]);
  }

  if (inclusive) {
    gradient.push(end);
  }

  return gradient;
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number = 0;
  let s: number = 0;
  const l: number = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}
