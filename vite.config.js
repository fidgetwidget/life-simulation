/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEBUG__: false, // true for dev, false for build
  },
});
