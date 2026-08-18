import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist-unused',
    rollupOptions: {
      input: 'src/unused.ts'
    }
  }
})
