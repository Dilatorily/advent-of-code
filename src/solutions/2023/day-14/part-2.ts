import { jsonParse } from '#dilatorily/advent-of-code/utility/json-parse';
import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { transposeMatrix } from '#dilatorily/advent-of-code/utility/transpose-matrix';

const cycles = 1000000000;

const tiltPlatformWest = (platform: string[][]) => {
  const tiltedPlatform: string[][] = [];
  platform.forEach((row, index) => {
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

  return tiltedPlatform;
};

const tiltPlatformNorth = (platform: string[][]) => {
  const transposedPlatform = transposeMatrix(platform);
  const tiltedPlatform = tiltPlatformWest(transposedPlatform);
  return transposeMatrix(tiltedPlatform);
};

const tiltPlatformEast = (platform: string[][]) => {
  const reversedPlatform = platform.map((row) => row.reverse());
  const tiltedPlatform = tiltPlatformWest(reversedPlatform);
  return tiltedPlatform.map((row) => row.reverse());
};

const tiltPlatformSouth = (platform: string[][]) => {
  const transposedPlatform = transposeMatrix(platform);
  const reversedPlatform = transposedPlatform.map((row) => row.reverse());
  const tiltedPlatform = tiltPlatformWest(reversedPlatform);
  return transposeMatrix(tiltedPlatform.map((row) => row.reverse()));
};

const tiltPlatform = (platform: string[]) => {
  const matrix = platform.map((row) => row.split(''));
  const tiltedNorth = tiltPlatformNorth(matrix);
  const tiltedWest = tiltPlatformWest(tiltedNorth);
  const tiltedSouth = tiltPlatformSouth(tiltedWest);
  const tiltedEast = tiltPlatformEast(tiltedSouth);
  return tiltedEast.map((row) => row.join(''));
};

const calculateLoad = (platform: string[]) =>
  platform
    .map((row, index) => (row.match(/O/g) ?? []).length * (platform.length - index))
    .reduce(sum);

export const solution = (lines: string[]) => {
  const cache: Record<string, number> = {};
  cache[JSON.stringify(lines)] = 0;

  let index = 0;
  let tiltedPlatform = lines;

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

  const [cyclePlatform] = Object.entries(cache).find(([, value]) => value === cycleIndex) ?? [''];
  const load = calculateLoad(jsonParse<string[]>(cyclePlatform));
  return load;
};
