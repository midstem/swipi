import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts({
      include: ['src'],
      exclude: [
        'src/UI',
        'src/Swipi/hooks',
        'src/Swipi/helpers',
        'src/Swipi/constants.ts',
        'src/helpers'
      ]
    })
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react']
    }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 8080
  },
  base: '/swipi/'
})
