export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/main/**/*',
    '!<rootDir>/src/data/protocols/**/*',
    '!<rootDir>/src/domain/models/*',
    '!<rootDir>/src/domain/usecases/*',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/*/mocks/*',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/presentation/components/index.tsx',
    '!<rootDir>/src/presentation/pages/index.tsx',
    '!**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/main/config/jest-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '@/(.*)': '<rootDir>/src/$1'
  }
};
