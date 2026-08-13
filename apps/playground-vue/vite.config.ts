import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const SWIPI_SOURCE = resolve('..', '..', 'packages', 'vue', 'src', 'index.ts')

export default defineConfig({
  resolve: {
    alias: {
      'swipi-vue': SWIPI_SOURCE
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,vue}']
  },
  server: {
    port: 3000
  },
  preview: {
    port: 8080
  },
  plugins: [vue()]
})
