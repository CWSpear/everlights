export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RedGreenBlueColor {
  red: number;
  green: number;
  blue: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface HueSaturationLightnessColor {
  hue: number;
  saturation: number;
  lightness: number;
}

export type ColorInput = string | number | number[] | RGBColor | RedGreenBlueColor | HSLColor | HueSaturationLightnessColor;
