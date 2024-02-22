import swc from 'unplugin-swc'
import { configDefaults, defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    exclude: [...configDefaults.exclude, '**/data/pg/**'],
  },
  plugins: [tsConfigPaths(), swc.vite({ module: { type: 'es6' } })],
})
