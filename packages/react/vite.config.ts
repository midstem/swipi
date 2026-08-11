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
    projects: [
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.ssr.test.{ts,tsx}']
        }
      },
      {
        extends: true,
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/*.ssr.test.{ts,tsx}']
        }
      }
    ]
  },
  plugins: [
    react(),
    dts({
      bundleTypes: { bundledPackages: ['@swipi/core'] },
      include: ['src'],
      exclude: [
        'src/test',
        'src/Swipi/hooks',
        'src/Swipi/helpers',
        'src/**/__test__/**',
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
