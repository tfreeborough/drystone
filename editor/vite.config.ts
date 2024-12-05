import rootConfig from '../vite.config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseConfig = rootConfig(__dirname);

export default defineConfig(() => {
  return mergeConfig(
    baseConfig,
    defineConfig({
      build: {
        sourcemap: true, // Required for Sentry source maps
      },
      plugins: [],
    }),
  );
});
