export default {
  '*.ts': ['npm run lint -- --fix', () => 'npm run typings'],
};
