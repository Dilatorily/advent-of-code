const convertPairToStructure = (pair, depth = 0) => {
  if (!Array.isArray(pair)) {
    return [[pair, depth]];
  }

  return [
    ...convertPairToStructure(pair[0], depth + 1),
    ...convertPairToStructure(pair[1], depth + 1),
  ];
};

const convertStructureToPair = (data) => {
  const copy = JSON.parse(JSON.stringify(data));
  const stack = [];

  while (copy.length > 0) {
    stack.push(copy.shift());

    if (stack.length > 1 && stack[stack.length - 2][1] === stack[stack.length - 1][1]) {
      const right = stack.pop();
      const left = stack.pop();
      copy.unshift([[left[0], right[0]], left[1] - 1]);
    }
  }

  return stack[0][0];
};

const example = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((string) => convertPairToStructure(JSON.parse(string)));

const shouldExplode = (data) => data.some(([, depth]) => depth > 4);
const shouldSplit = (data) => data.some(([value]) => value > 9);
const shouldBeReduced = (data) => shouldExplode(data) || shouldSplit(data);

const explode = (data) => {
  const copy = JSON.parse(JSON.stringify(data));
  const stack = [];

  while (copy[0][1] <= 4 || copy[0][1] !== copy[1][1]) {
    stack.push(copy.shift());
  }

  const left = copy.shift();
  if (stack.length > 0) {
    stack[stack.length - 1][0] += left[0];
  }

  const right = copy.shift();
  if (copy.length > 0) {
    copy[0][0] += right[0];
  }

  return [...stack, [0, left[1] - 1], ...copy];
};

const split = (data) => {
  const copy = JSON.parse(JSON.stringify(data));
  const stack = [];

  while (copy[0][0] <= 9) {
    stack.push(copy.shift());
  }

  const pair = copy.shift();

  return [
    ...stack,
    [Math.floor(pair[0] / 2), pair[1] + 1],
    [Math.ceil(pair[0] / 2), pair[1] + 1],
    ...copy,
  ];
};

const reduce = (data1, data2) => {
  let temporaryData = [...data1, ...data2].map((data) => [data[0], data[1] + 1]);

  while (shouldBeReduced(temporaryData)) {
    if (shouldExplode(temporaryData)) {
      temporaryData = explode(temporaryData);
    } else if (shouldSplit(temporaryData)) {
      temporaryData = split(temporaryData);
    }
  }

  return temporaryData;
};

const calculateMagnitude = (pair) => {
  if (!Array.isArray(pair)) {
    return pair;
  }

  return 3 * calculateMagnitude(pair[0]) + 2 * calculateMagnitude(pair[1]);
};

calculateMagnitude(
  convertStructureToPair(
    example.slice(1).reduce((data1, data2) => reduce(data1, data2), example[0]),
  ),
);
