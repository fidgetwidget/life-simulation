/// <reference types="vite-plus" />
import { defineConfig } from 'vite-plus';
import tsconfigPaths from 'vite-tsconfig-paths';
import oxlintPlugin from 'vite-plugin-oxlint';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [],
  },
  define: {
    __DEBUG__: false, // true for dev, false for build
  },
  plugins: [tsconfigPaths(), oxlintPlugin()],
});
