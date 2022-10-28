import { EverLights } from '../src/v1-sdk';

(async () => {
  const everlights = new EverLights({
    ip: '192.168.1.130',
  });

  try {
    await everlights.connect();

    await everlights.off();
  } finally {
    await everlights.disconnect();
  }
})().catch(err => {
  console.error('Unhandled error', err);
})