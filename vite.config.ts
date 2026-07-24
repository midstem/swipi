import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
export default defineConfig({
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
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime']
    }
  }
})
