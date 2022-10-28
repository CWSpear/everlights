import { EverLights } from '../src/v3-sdk';

(async () => {
  const everLights = new EverLights({ host: process.env.EVER_LIGHTS_HOST! });

  await everLights.reboot();
  await everLights.waitForReady();
})().catch((err) => {
  console.error('General Error', err);
});
