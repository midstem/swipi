import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const SWIPI_SOURCE = resolve(
  '..',
  '..',
  'packages',
  'svelte',
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
      { find: /^@midstem\/swipi-svelte$/, replacement: SWIPI_SOURCE },
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
  plugins: [tailwindcss(), svelte(), svelteTesting()]
})
