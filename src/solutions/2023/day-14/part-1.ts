import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { transposeMatrix } from '#dilatorily/advent-of-code/utility/transpose-matrix';

const tiltPlatform = (platform: string[]) => {
  const transposedPlatform = transposeMatrix(platform.map((row) => row.split('')));

  const tiltedPlatform: string[][] = [];
  transposedPlatform.forEach((row, index) => {
    tiltedPlatform.push([]);

    let stack: string[] = [];
    row.forEach((space) => {
      if (space === 'O') {
        stack.unshift('O');
      }

      if (space === '.') {
        stack.push('.');
      }

      if (space === '#') {
        tiltedPlatform[index].push(...stack, '#');
        stack = [];
      }
    });

    tiltedPlatform[index].push(...stack);
  });

  return transposeMatrix(tiltedPlatform).map((row) => row.join(''));
};

const calculateLoad = (platform: string[]) =>
  platform
    .map((row, index) => (row.match(/O/g) ?? []).length * (platform.length - index))
    .reduce(sum);

export const solution = (lines: string[]) => {
  const tiltedPlatform = tiltPlatform(lines);
  const load = calculateLoad(tiltedPlatform);
  return load;
};
