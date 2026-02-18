import { stringToCharArray } from '#dilatorily/advent-of-code/utility/string-to-char-array';

export const reverseString = (string: string) => stringToCharArray(string).reverse().join('');
