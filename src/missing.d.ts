declare module 'color-normalize' {
  import { ColorInput } from '../types';
  export default function (colorInput: ColorInput): [red: number, green: number, blue: number, alpha: number] {}
}
