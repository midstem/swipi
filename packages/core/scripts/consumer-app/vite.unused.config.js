import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist-unused',
    rollupOptions: {
      input: 'src/unused.ts'
    }
  }
})
