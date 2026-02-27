import { stringToCharArray } from '#dilatorily/advent-of-code/utility/string-to-char-array';

export const solution = (lines: string[], iterations = 40) => {
  const lookAndSay = (sequence: string, iterationsLeft: number) => {
    if (iterationsLeft === 0) {
      return sequence.length;
    }

    const numbers = stringToCharArray(sequence);
    let newSequence = '';
    let currentNumber = numbers[0];
    let count = 1;

    for (let index = 0; index < numbers.length; ++index) {
      if (index === 0) {
        continue;
      }

      const number = numbers[index];

      if (number === currentNumber) {
        count += 1;
      } else {
        newSequence += `${count}${currentNumber}`;
        currentNumber = number;
        count = 1;
      }
    }
    newSequence += `${count}${currentNumber}`;

    return lookAndSay(newSequence, iterationsLeft - 1);
  };

  return lookAndSay(lines[0], iterations);
};
