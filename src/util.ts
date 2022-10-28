import normalizeColor from 'color-normalize';
import type {
  ObjectSchema,
  ValidationError as JoiValidationError,
  ValidationErrorItem as JoiValidationErrorItem,
} from 'joi';
import * as util from 'util';
import type {
  ColorInput,
  Effect,
  EffectInput,
  Program,
  ProgramInput,
  RGBColor,
  ScheduledEvent,
  Sequence,
  SequenceInput,
} from './types';

export const hexColorRegex = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export function socketColorHex(input: ColorInput): string {
  // EverLights via sockets expects colors in GRB format
  return colorHex(input).replace(hexColorRegex, '$2$1$3');
}

export function colorHex(input: ColorInput): string {
  // normalizeColor does not handle hex numbers without a `#`, e.g. `ffffff` would come back as `NaNNaNNaNNaNNaNNaN`
  if (typeof input === 'string' && hexColorRegex.test(input)) {
    return input.toUpperCase().replace('#', '');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [r, g, b, alpha] = normalizeColor(input);
  const [rHex, gHex, bHex] = [r, g, b].map((c) => hex(Math.round(c * 255)));

  return [rHex, gHex, bHex].join('').toUpperCase();
}

export function colorRGB(input: ColorInput): RGBColor {
  if (typeof input === 'string' && hexColorRegex.test(input)) {
    input = hexToRGB(input);
  }

  const [r, g, b, alpha] = normalizeColor(input);
  return { r, g, b };
}

export function hexToRGB(hexStr: string): RGBColor {
  const [r, g, b] = hexStr
    .replace(hexColorRegex, '$1,$2,$3')
    .split(',')
    .map((v) => parseInt(v, 16));

  return { r, g, b };
}

export function hex(number: number): string {
  return number.toString(16).padStart(2, '0');
}

type Validatedable = Sequence | Effect | Program | ScheduledEvent | SequenceInput | EffectInput | ProgramInput;

type Cons<H, T> = T extends readonly unknown[]
  ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? {
      [K in keyof T]-?: [K] | (Paths<T[K], Prev[D]> extends infer P ? (P extends [] ? never : Cons<K, P>) : never);
    }[keyof T]
  : [];

export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? { [K in keyof T]-?: Cons<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : [];

interface ValidationErrorItem<T> extends Omit<JoiValidationErrorItem, 'path'> {
  path: Paths<T>;
}

// const test: Paths<Sequence> = ['effects', 3, 'effectType'];

interface ValidationError<T> extends Omit<JoiValidationError, 'details'> {
  details: ValidationErrorItem<T>[];
}

interface ValidationResult<T extends Validatedable> {
  // } extends Record<keyof JoiValidationResult, any> {
  value: Required<T>;
  error?: ValidationError<T>;
  warning?: ValidationError<T>;
}

export function validate<T extends Validatedable>(schema: ObjectSchema<T>, input: T): ValidationResult<T>['value'] {
  const { value, error } = schema.validate(input, { stripUnknown: true, allowUnknown: true, abortEarly: false });

  if (error) {
    prettyDeepPrint(error.details);
    // throw error;
    throw new Error(error.message);
  }

  return <ValidationResult<T>['value']>value;
}

export function prettyDeepPrint(...items: unknown[]): void {
  console.log(...items.map((item) => util.inspect(item, { colors: true, depth: 8 })));
}
