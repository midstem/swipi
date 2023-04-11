import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [svgr(), reactRefresh()],
});
