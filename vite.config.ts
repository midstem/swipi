import react from '@vitejs/plugin-react'
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
    setupFiles: ['./src/test/setup.ts']
  },
  server: {
    port: 3000
  },
  preview: {
    port: 8080
  },
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: [
        'src/Playground',
        'src/test',
        'src/Swipi/hooks',
        'src/Swipi/helpers',
        'src/**/*.test.{ts,tsx}'
      ]
    })
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => FILE_NAME_BY_FORMAT[format]
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: { exports: 'named' }
    }
  }
})
