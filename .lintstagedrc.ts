import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*.{ts,tsx}': [
    'npm run lint -- --fix',
    () => 'npm run typings',
  ],
  '*.{js,jsx}': ['npm run lint -- --fix'],
};

export default config;
