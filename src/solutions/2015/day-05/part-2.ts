import { stringToCharArray } from '#dilatorily/advent-of-code/utility/string-to-char-array';

const hasTwoPairsOfLetters = (string: string) => {
  const pairs: Record<string, number[] | undefined> = {};

  for (let index = 0; index < string.length - 1; index += 1) {
    const key = `${string[index]}${string[index + 1]}`;
    if (pairs[key]) {
      if (pairs[key].some((pair) => index !== pair + 1)) {
        return true;
      }
    } else {
      pairs[key] = [index];
    }
  }

  return false;
};

const hasRepeatingLetter = (string: string) =>
  stringToCharArray(string).some((character, index) => character === string[index + 2]);

const isNice = (string: string) => hasTwoPairsOfLetters(string) && hasRepeatingLetter(string);

export const solution = (lines: string[]) => lines.filter(isNice).length;
