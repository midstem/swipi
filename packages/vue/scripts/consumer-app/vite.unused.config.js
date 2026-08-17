import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist-unused',
    rollupOptions: {
      input: 'src/unused.ts'
    }
  }
})
