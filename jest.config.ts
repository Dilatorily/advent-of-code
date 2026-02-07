export default {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: { allowJs: true }, useESM: true }],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*))'],
};
