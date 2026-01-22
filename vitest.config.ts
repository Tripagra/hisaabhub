import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '.next/',
        'out/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/lib': resolve(__dirname, 'src/lib'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/app': resolve(__dirname, 'src/app'),
    },
  },
});