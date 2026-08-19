import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const FILE_NAME_BY_FORMAT: Record<string, string> = {
  es: 'index.js',
  cjs: 'index.cjs'
}

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['../../tools/tests/index.ts']
  },
  plugins: [
    dts({
      bundleTypes: true,
      include: ['src'],
      exclude: ['src/**/__test__/**', 'src/**/*.test.ts']
    })
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => FILE_NAME_BY_FORMAT[format]
    },
    rollupOptions: {
      output: { exports: 'named' }
    }
  }
})
