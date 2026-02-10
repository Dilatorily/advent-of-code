import importAliasPlugin from '@dword-design/eslint-plugin-import-alias';
import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  importAliasPlugin.configs.recommended,
  jestPlugin.configs['flat/recommended'],
  jestPlugin.configs['flat/style'],
  prettierPlugin,
  {
    files: ['*.config.ts', 'src/**/*.ts'],
    languageOptions: { parserOptions: { projectService: true } },
    plugins: { 'unused-imports': unusedImportsPlugin },
    rules: {
      '@dword-design/import-alias/prefer-alias': ['error', { aliasForSubpaths: true }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { string: true } },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'no-console': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  { ignores: ['node_modules', 'src/solutions/**/*.js'] },
]);
