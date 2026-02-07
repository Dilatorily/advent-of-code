import reduceSum from '#dilatorily/advent-of-code/utility/reduce-sum';
import transposeMatrix from '#dilatorily/advent-of-code/utility/transpose-matrix';

const cycles = 1000000000;
const cache = {};

const tiltPlatformWest = (platform) => {
  const tiltedPlatform = [];
  platform.forEach((row, index) => {
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

  return tiltedPlatform;
};

const tiltPlatformNorth = (platform) => {
  const transposedPlatform = transposeMatrix(platform);
  const tiltedPlatform = tiltPlatformWest(transposedPlatform);
  return transposeMatrix(tiltedPlatform);
};

const tiltPlatformEast = (platform) => {
  const reversedPlatform = platform.map((row) => row.reverse());
  const tiltedPlatform = tiltPlatformWest(reversedPlatform);
  return tiltedPlatform.map((row) => row.reverse());
};

const tiltPlatformSouth = (platform) => {
  const transposedPlatform = transposeMatrix(platform);
  const reversedPlatform = transposedPlatform.map((row) => row.reverse());
  const tiltedPlatform = tiltPlatformWest(reversedPlatform);
  return transposeMatrix(tiltedPlatform.map((row) => row.reverse()));
};

const tiltPlatform = (platform) => {
  const matrix = platform.map((row) => row.split(''));
  const tiltedNorth = tiltPlatformNorth(matrix);
  const tiltedWest = tiltPlatformWest(tiltedNorth);
  const tiltedSouth = tiltPlatformSouth(tiltedWest);
  const tiltedEast = tiltPlatformEast(tiltedSouth);
  return tiltedEast.map((row) => row.join(''));
};

const calculateLoad = (platform) =>
  platform
    .map((row, index) => (row.match(/O/g) ?? []).length * (platform.length - index))
    .reduce(reduceSum);

export default (input) => {
  const platform = input.split('\n');
  cache[JSON.stringify(platform)] = 0;

  let index = 0;
  let tiltedPlatform = platform;

  while (index < cycles) {
    index += 1;
    tiltedPlatform = tiltPlatform(tiltedPlatform);
    const key = JSON.stringify(tiltedPlatform);

    if (cache[key]) {
      break;
    } else {
      cache[key] = index;
    }
  }

  const cycleStart = cache[JSON.stringify(tiltedPlatform)];
  const cycleLength = index - cycleStart;
  const cycleIndex = cycleStart + ((cycles - cycleStart) % cycleLength);

  const [cyclePlatform] = Object.entries(cache).find(([, value]) => value === cycleIndex);
  const load = calculateLoad(JSON.parse(cyclePlatform));
  return load;
};
