const getPath = (instructions, network) => {
  const sequence = instructions.split('');
  const path = ['AAA'];

  for (let index = 0; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const direction = sequence[index % sequence.length];
    let node = path[path.length - 1];
    path.push(network[node][direction]);

    node = path[path.length - 1];
    if (node === 'ZZZ') {
      break;
    }
  }

  return path;
};
const getPathLength = (instructions, network) => getPath(instructions, network).length - 1;

const [instructions, , ...nodes] = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1);

getPathLength(
  instructions,
  nodes.reduce((map, node) => {
    const [element, directions] = node.split(' = ');
    const [left, right] = directions.slice(1, -1).split(', ');

    return Object.assign(map, { [element]: { L: left, R: right } });
  }, {}),
);
