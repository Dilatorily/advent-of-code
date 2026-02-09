export default {
  '*.ts': ['npm run lint -- --fix', () => 'npm run typings'],
  '*.js': ['npm run lint -- --fix'],
};
