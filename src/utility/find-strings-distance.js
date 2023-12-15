import reduceSum from './reduce-sum.js';

export default (a, b) =>
  a
    .split('')
    .map((character, index) => (character === b[index] ? 0 : 1))
    .reduce(reduceSum);
