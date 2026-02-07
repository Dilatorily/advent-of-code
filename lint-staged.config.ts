export default {
  '*.{ts,tsx}': ['npm run lint -- --fix', () => 'npm run typings'],
  '*.{js,jsx}': ['npm run lint -- --fix'],
};
