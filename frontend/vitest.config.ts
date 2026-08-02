import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,

    // Run everything in one worker to avoid the startup timeout.
    pool: 'vmForks',
    maxWorkers: 1,
    fileParallelism: false,
    isolate: false,
  },
})