import { findStringsDistance } from '#dilatorily/advent-of-code/utility/find-strings-distance';
import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { reverseString } from '#dilatorily/advent-of-code/utility/reverse-string';
import { transposeMatrix } from '#dilatorily/advent-of-code/utility/transpose-matrix';

const findVerticalReflection = (terrain, smudges = 0) => {
  for (let index = 1; index < terrain[0].length; index += 1) {
    const reflectionLength = Math.min(
      terrain[0].slice(0, index).length,
      terrain[0].slice(index).length,
    );

    const leftReflection = terrain
      .map((row) => row.slice(index - reflectionLength, index))
      .join('');
    const rightReflection = terrain
      .map((row) => reverseString(row.slice(index, index + reflectionLength)))
      .join('');

    const difference = findStringsDistance(leftReflection, rightReflection);

    if (difference === smudges) {
      return index;
    }
  }

  return -1;
};

const findHorizontalReflection = (terrain, smudges = 0) => {
  const transposedTerrain = transposeMatrix(terrain.map((row) => row.split(''))).map((row) =>
    row.join(''),
  );

  return findVerticalReflection(transposedTerrain, smudges);
};

export default (input) => {
  const terrains = input.split('\n\n').map((terrain) => terrain.split('\n'));

  const summarize = terrains
    .map((terrain) => {
      const verticalIndex = findVerticalReflection(terrain, 1);

      if (verticalIndex >= 0) {
        return verticalIndex;
      }

      const horizontalIndex = findHorizontalReflection(terrain, 1);
      if (horizontalIndex >= 0) {
        return horizontalIndex * 100;
      }

      return 0;
    })
    .reduce(sum);

  return summarize;
};
