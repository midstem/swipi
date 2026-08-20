import tailwindcss from '@tailwindcss/vite'
import angular from '@analogjs/vite-plugin-angular'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const SWIPI_SOURCE = resolve(
  '..',
  '..',
  'packages',
  'angular',
  'src',
  'index.ts'
)

const PLAYGROUND_CORE_SOURCE = resolve(
  '..',
  '..',
  'packages',
  'playground-core',
  'src',
  'index.ts'
)

export default defineConfig({
  base: './',
  resolve: {
    alias: [
      { find: /^@midstem\/swipi-angular$/, replacement: SWIPI_SOURCE },
      {
        find: /^@swipi\/playground-core$/,
        replacement: PLAYGROUND_CORE_SOURCE
      }
    ]
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts']
  },
  server: {
    port: 3000
  },
  preview: {
    port: 8080
  },
  plugins: [tailwindcss(), angular({ tsconfig: 'tsconfig.json' })]
})
