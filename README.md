# EverLights SDK

**This project is a Work in Progress.** The basics are there, but there are bound to be some mistakes and there's currently virtually no validation or documentation.

A developer-friendly SDK for [EverLights](https://myeverlights.com/) (v3 controller). I reversed engineered the API by intercepting traffic on my phone and working out the API from there. 

To use, you'll need your EverLights Bridge IP address, which can be found in the app Settings -> Bridge.

No documentation yet, but I've done my best to create simple to follow and read API. You can check out [./src/v3-sdk.ts](./src/v3-sdk.ts) to get the basics. To me, the most import part is changing what the lights are doing. This is the only sort of non-standard thing I did. I've called this a `Program`, for lack of a better term. These are the patterns effects that dictate how the lights behave. So I abstracted that a bit away, and you can "start/stop programs" for zones.

### Usage

Just install this from `npm`:

```bash
npm install everlights
```

You can see the [Example](#Example) below to get an idea of usage. More documentation coming soon-ish. Maybe?

### Types

All the endpoints' requests and responses have been typed. They may not be 100% accurate right now, but it's close. So the main benefit of this SDK is using it with TypeScript to help you very quickly know what data to send and what data to return.

Set all the types used in [./src/types/](./src/types/).

### Color Inputs

The [`color-normalize`](https://github.com/colorjs/color-normalize) package is used so allow for a very wide array of color inputs. Anything that's valid in CSS can be used here (pass in the string, e.g. `rgb(0, 0, 0)`), as well as array and object values. Transparencies are ignored.

```ts
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
```

### Example

```ts
import { ColorInput, EffectInput, EffectType, EverLights, Zone } from 'everlights';

// `host` would be the one you found earlier, e.g. 192.168.1.105
const everLights = new EverLights({ host: process.env.EVER_LIGHTS_HOST! });

(async () => {
  // get the first zone (I only have one)
  const [zone]: Zone[] = await everLights.getZones();

  const pattern: ColorInput[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  // effects are optional. some can be combined. currently, there is no input validation
  const effects: EffectInput[] = [
    {
      // enum to helper with the effects
      type: EffectType.Chase,
      // speed value 0-255
      speed: 255,
    },
  ];

  await everLights.startProgram(zone.serial, pattern, effects);

  // alternatively, you can create a "zone helper" sub-SDK to not have to keep passing the serial around
  const zoneHelper = everLights.makeZoneHelper(zone.serial);
  // this is equivalent to the everLights.startProgram above
  await zoneHelper.startProgram(pattern, effects);

  // this will turn all the lights off in the zone
  await everLights.stopProgram(zone.serial);
  
  // of you can use the zone helper
  await zoneHelper.stopProgram();
})().catch((err) => {
  console.error('Error', err?.response?.data || err.message);
});
```

### TODO

* Add validation.
* Add sane defaults (e.g. don't make user generate UUIDs for creating stuff, generate timestamps, etc).
* Documentation.
* Keep Open API spec up to date.
