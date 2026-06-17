/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: {
    __DEBUG__: false, // true for dev, false for build
  },
  plugins: [tsconfigPaths()],
});
