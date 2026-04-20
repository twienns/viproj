import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'], // только .test.ts
    exclude: ['tests/**/*.types.ts'],
  },
});