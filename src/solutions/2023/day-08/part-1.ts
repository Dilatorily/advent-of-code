const getPath = (instructions: string, network: Record<string, { L: string; R: string }>) => {
  const sequence = instructions.split('');
  const path = ['AAA'];

  for (let index = 0; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const direction = sequence[index % sequence.length] as 'L' | 'R';
    let node = path[path.length - 1];
    path.push(network[node][direction]);

    node = path[path.length - 1];
    if (node === 'ZZZ') {
      break;
    }
  }

  return path;
};

const getPathLength = (instructions: string, network: Record<string, { L: string; R: string }>) =>
  getPath(instructions, network).length - 1;

export const solution = (lines: string[]) => {
  const [instructions, , ...nodes] = lines;

  return getPathLength(
    instructions,
    nodes.reduce<Record<string, { L: string; R: string }>>((map, node) => {
      const [element, directions] = node.split(' = ');
      const [left, right] = directions.slice(1, -1).split(', ');

      return Object.assign(map, { [element]: { L: left, R: right } });
    }, {}),
  );
};
