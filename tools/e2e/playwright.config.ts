import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const PLAYGROUND_PORT = 3000
const PLAYGROUND_URL = `http://localhost:${PLAYGROUND_PORT}`

const playgroundDir = fileURLToPath(
  new URL('../../apps/playground-react', import.meta.url)
)

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: PLAYGROUND_URL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: `npx vite --port ${PLAYGROUND_PORT} --strictPort`,
    cwd: playgroundDir,
    url: PLAYGROUND_URL,
    reuseExistingServer: true,
    timeout: 120_000
  }
})
