/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', 'src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['tests/e2e/**', '.next/**', 'node_modules/**', 'tests/setup.ts', '**/*.md'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.d.ts',
        '.next/',
        '**/*.config.*',
        'tests/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
