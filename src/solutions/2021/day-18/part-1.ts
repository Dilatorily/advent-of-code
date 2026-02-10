import { deepCopy } from '#dilatorily/advent-of-code/utility/deep-copy';
import { jsonParse } from '#dilatorily/advent-of-code/utility/json-parse';

type Pair = number | [Pair, Pair];
type Structure = [Pair, number][];

const convertPairToStructure = (pair: Pair, depth = 0): Structure => {
  if (!Array.isArray(pair)) {
    return [[pair, depth]];
  }

  return [
    ...convertPairToStructure(pair[0], depth + 1),
    ...convertPairToStructure(pair[1], depth + 1),
  ];
};

const convertStructureToPair = (data: Structure) => {
  const copy = deepCopy(data);
  const stack: Structure = [];

  while (copy.length > 0) {
    stack.push(copy.shift() as [Pair, number]);

    if (stack.length > 1 && stack[stack.length - 2][1] === stack[stack.length - 1][1]) {
      const right = stack.pop() as [Pair, number];
      const left = stack.pop() as [Pair, number];
      copy.unshift([[left[0], right[0]], left[1] - 1]);
    }
  }

  return stack[0][0];
};

const shouldExplode = (data: Structure) => data.some(([, depth]) => depth > 4);
const shouldSplit = (data: Structure) =>
  data.some(([value]) => typeof value === 'number' && value > 9);
const shouldBeReduced = (data: Structure) => shouldExplode(data) || shouldSplit(data);

const explode = (data: Structure) => {
  const copy = deepCopy(data);
  const stack: Structure = [];

  while (copy[0][1] <= 4 || copy[0][1] !== copy[1][1]) {
    stack.push(copy.shift() as [Pair, number]);
  }

  const left = copy.shift() as [Pair, number];
  if (stack.length > 0) {
    (stack[stack.length - 1][0] as number) += left[0] as number;
  }

  const right = copy.shift() as [Pair, number];
  if (copy.length > 0) {
    (copy[0][0] as number) += right[0] as number;
  }

  return [...stack, [0, left[1] - 1] as [Pair, number], ...copy];
};

const split = (data: Structure) => {
  const copy = deepCopy(data);
  const stack: Structure = [];

  while (typeof copy[0][0] === 'number' && copy[0][0] <= 9) {
    stack.push(copy.shift() as [Pair, number]);
  }

  const pair = copy.shift() as [number, number];

  return [
    ...stack,
    [Math.floor(pair[0] / 2), pair[1] + 1] as [Pair, number],
    [Math.ceil(pair[0] / 2), pair[1] + 1] as [Pair, number],
    ...copy,
  ];
};

const reduce = (data1: Structure, data2: Structure) => {
  let temporaryData = [...data1, ...data2].map<[Pair, number]>((data) => [data[0], data[1] + 1]);

  while (shouldBeReduced(temporaryData)) {
    if (shouldExplode(temporaryData)) {
      temporaryData = explode(temporaryData);
    } else if (shouldSplit(temporaryData)) {
      temporaryData = split(temporaryData);
    }
  }

  return temporaryData;
};

const calculateMagnitude = (pair: Pair): number => {
  if (!Array.isArray(pair)) {
    return pair;
  }

  return 3 * calculateMagnitude(pair[0]) + 2 * calculateMagnitude(pair[1]);
};

export const solution = (lines: string[]) => {
  const example = lines.map((string) => convertPairToStructure(jsonParse<Pair>(string)));

  return calculateMagnitude(
    convertStructureToPair(
      example.slice(1).reduce((data1, data2) => reduce(data1, data2), example[0]),
    ),
  );
};
