import reduceSum from '../../utility/reduce-sum.js';

const hash = (string) =>
  string.split('').reduce((value, character) => {
    let newValue = value;

    newValue += character.charCodeAt();
    newValue *= 17;
    newValue %= 256;

    return newValue;
  }, 0);

export default (input) => {
  const sum = input
    .split(',')
    .map((step) => hash(step))
    .reduce(reduceSum);
  return sum;
};
