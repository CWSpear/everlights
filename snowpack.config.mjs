// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
const config = {
  mode: 'production',
  mount: {
    src: '/lib',
    public: '/',
  },
  plugins: [
    ['@snowpack/plugin-typescript', { args: '--project ./tsconfig.build.json' }],
  ],
  buildOptions: {
    out: './dist/import/',
    sourcemap: true,
  },
  exclude: [
    '**/src/v1-sdk.ts',
    '**/src/scratch.ts',
    '**/src/types/index.ts',
  ],
};

export default config;
