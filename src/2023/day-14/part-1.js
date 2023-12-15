import reduceSum from '../../utility/reduce-sum.js';
import transposeMatrix from '../../utility/transpose-matrix.js';

const tiltPlatform = (platform) => {
  const transposedPlatform = transposeMatrix(platform.map((row) => row.split('')));

  const tiltedPlatform = [];
  transposedPlatform.forEach((row, index) => {
    tiltedPlatform.push([]);

    let stack = [];
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

const calculateLoad = (platform) =>
  platform
    .map((row, index) => (row.match(/O/g) ?? []).length * (platform.length - index))
    .reduce(reduceSum);

export default (input) => {
  const platform = input.split('\n');
  const tiltedPlatform = tiltPlatform(platform);
  const load = calculateLoad(tiltedPlatform);
  return load;
};
