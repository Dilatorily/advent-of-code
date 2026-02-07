export default {
  arrowParens: 'always',
  importOrder: ['<BUILTIN_MODULES>', '', '<THIRD_PARTY_MODULES>', '', '^[.]', '', '<TYPES>'],
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
};
