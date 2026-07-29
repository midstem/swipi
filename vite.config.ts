import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
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
    libInjectCss(),
    dts({
      include: ['src'],
      exclude: [
        'src/Playground',
        'src/test',
        'src/UI',
        'src/Swipi/hooks',
        'src/Swipi/helpers',
        'src/helpers',
        'src/**/*.test.{ts,tsx}'
      ]
    })
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => FILE_NAME_BY_FORMAT[format],
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime']
    }
  }
})
