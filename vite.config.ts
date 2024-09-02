/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import * as path from 'path';
import type { InlineConfig } from 'vitest';
import type { UserConfig } from 'vite';

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  },
  server: {
    watch: {
      usePolling: true
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      include: ['src/data/**/*', 'src/domain/**/*', 'src/infra/**/*', 'src/main/**/*', 'src/presentation/**/*'],
      exclude: [
        'src/main/factories/**/*',
        'src/**/*.stories.{ts,tsx}',
        'src/main/helpers/**/*',
        'src/main/index.tsx',
        'src/main/config/**/*',
        'src/main/proxies/**/*',
        'src/main/routes/**/*',
        'src/main/styles/**/*',
        'src/domain/mocks/**/*',
        'src/data/protocols/**/*',
        'src/domain/models/*',
        'src/domain/usecases/*',
        'src/**/index.ts',
        'src/*/mocks/*',
        'src/presentation/components/index.tsx',
        'src/presentation/pages/index.tsx',
        'src/presentation/components/story-wrapper/chakra-story-wrapper.tsx',
        'src/presentation/components/layout/components/player.tsx', // Ignore because the drag and drog feature cannot be tested with our current testing library
        'src/presentation/components/form-select/form-select.tsx' // Ignore because this chakra-ui component is not being rendered in the test environment
      ],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100
    },
    setupFiles: ['vitest-localstorage-mock'],
    mockReset: false,
    testTimeout: 30000
  },
  plugins: [react(), EnvironmentPlugin('all')]
} as VitestConfigExport);
