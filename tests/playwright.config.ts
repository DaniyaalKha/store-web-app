// @ts-nocheck
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },

  webServer: {
    command: 'pnpm --filter web dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !(typeof process !== 'undefined' && process.env && process.env.CI),
    stdout: 'ignore',
    stderr: 'ignore',
  },

  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
})