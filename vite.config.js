/// <reference types="vite-plus" />
import { defineConfig } from 'vite-plus';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 80,
    sortImports: true,
    sortPackageJson: false,
    ignorePatterns: [],
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  define: {
    __DEBUG__: false, // true for dev, false for build
  },
  plugins: [],
});
