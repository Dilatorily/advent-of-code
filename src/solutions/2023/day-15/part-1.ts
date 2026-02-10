import { sum as reduceSum } from '#dilatorily/advent-of-code/utility/sum';

const hash = (string: string) =>
  string.split('').reduce((value, character) => {
    let newValue = value;

    newValue += character.charCodeAt(0);
    newValue *= 17;
    newValue %= 256;

    return newValue;
  }, 0);

export const solution = (lines: string[]) => {
  const sum = lines[0]
    .split(',')
    .map((step) => hash(step))
    .reduce(reduceSum, 0);
  return sum;
};
