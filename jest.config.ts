export default {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^#dilatorily/advent-of-code/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.(j|t)s$': [
      'ts-jest',
      { tsconfig: { allowJs: true, verbatimModuleSyntax: false }, useESM: true },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*))'],
};
