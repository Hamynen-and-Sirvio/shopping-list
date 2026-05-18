import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: new RegExp(`^${__dirname.replaceAll('\\', '/')}/src/`),
        testsToRun: () => './tests/integration.test.ts',
      },
    ],
  },
})
