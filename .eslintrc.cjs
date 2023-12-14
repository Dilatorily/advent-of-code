module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  env: { browser: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', },
  rules: { 'import/extensions': ['error', 'always'], 'no-console': 'off' },
};
