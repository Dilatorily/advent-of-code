const greatestCommonDivisor = (a: number, b: number): number =>
  a ? greatestCommonDivisor(b % a, a) : b;
const leastCommonMultiple = (a: number, b: number) => (a * b) / greatestCommonDivisor(a, b);

const getPath = (
  instructions: string,
  network: Record<string, { L: string; R: string }>,
  path: string[],
) => {
  const sequence = instructions.split('');

  for (let index = 0; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const direction = sequence[index % sequence.length] as 'L' | 'R';
    let node = path[path.length - 1];
    path.push(network[node][direction]);

    node = path[path.length - 1];
    if (node.endsWith('Z')) {
      break;
    }
  }

  return path;
};

const getPathLength = (
  instructions: string,
  network: Record<string, { L: string; R: string }>,
  path: string[],
) => getPath(instructions, network, path).length - 1;

export const solution = (lines: string[]) => {
  const [instructions, , ...nodes] = lines;

  const network = nodes.reduce<Record<string, { L: string; R: string }>>((map, node) => {
    const [element, directions] = node.split(' = ');
    const [left, right] = directions.slice(1, -1).split(', ');

    return Object.assign(map, { [element]: { L: left, R: right } });
  }, {});

  return Object.keys(network)
    .filter((node) => node.endsWith('A'))
    .map((node) => getPathLength(instructions, network, [node]))
    .reduce(leastCommonMultiple);
};
