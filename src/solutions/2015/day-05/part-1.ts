import { stringToCharArray } from '#dilatorily/advent-of-code/utility/string-to-char-array';

const hasThreeVowels = (string: string) =>
  stringToCharArray(string).filter((character) => ['a', 'e', 'i', 'o', 'u'].includes(character))
    .length >= 3;

const hasDoubleLetter = (string: string) =>
  stringToCharArray(string).some((character, index) => character === string[index + 1]);

const hasForbiddenSubstring = (string: string) =>
  ['ab', 'cd', 'pq', 'xy'].some((forbiddenSubstring) => string.includes(forbiddenSubstring));

const isNice = (string: string) =>
  hasThreeVowels(string) && hasDoubleLetter(string) && !hasForbiddenSubstring(string);

export const solution = (lines: string[]) => lines.filter(isNice).length;
