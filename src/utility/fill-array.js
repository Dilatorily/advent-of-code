export default (length, fill = '') =>
  [...Array(length).fill(undefined)].map(() => JSON.parse(JSON.stringify(fill)));
