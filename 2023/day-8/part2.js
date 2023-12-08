const greatestCommonDivisor = (a, b) => (a ? greatestCommonDivisor(b % a, a) : b);
const leastCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);

const getPath = (instructions, network, path) => {
  const sequence = instructions.split('');

  for (let index = 0; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const direction = sequence[index % sequence.length];
    let node = path[path.length - 1];
    path.push(network[node][direction]);

    node = path[path.length - 1];
    if (node[node.length - 1] === 'Z') {
      break;
    }
  }

  return path;
};
const getPathLength = (instructions, network, path) =>
  getPath(instructions, network, path).length - 1;

const [instructions, , ...nodes] = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1);

const network = nodes.reduce((map, node) => {
  const [element, directions] = node.split(' = ');
  const [left, right] = directions.slice(1, -1).split(', ');

  return Object.assign(map, { [element]: { L: left, R: right } });
}, {});

Object.keys(network)
  .filter((node) => node[node.length - 1] === 'A')
  .map((node) => getPathLength(instructions, network, [node]))
  .reduce(leastCommonMultiple);
