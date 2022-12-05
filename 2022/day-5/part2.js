const stacks = [
  ['B', 'Q', 'C'],
  ['R', 'Q', 'W', 'Z'],
  ['B', 'M', 'R', 'L', 'V'],
  ['C', 'Z', 'H', 'V', 'T', 'W'],
  ['D', 'Z', 'H', 'B', 'N', 'V', 'G'],
  ['H', 'N', 'P', 'C', 'J', 'F', 'V', 'Q'],
  ['D', 'G', 'T', 'R', 'W', 'Z', 'S'],
  ['C', 'G', 'M', 'N', 'B', 'W', 'Z', 'P'],
  ['N', 'J', 'B', 'M', 'W', 'Q', 'F', 'P'],
];

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(10, -1)
  .forEach((move) => {
    let strings = move.split('move ')[1];
    const number = parseInt(strings.split(' from ')[0], 10);
    [, strings] = strings.split(' from ');
    const fromIndex = parseInt(strings.split(' to ')[0], 10) - 1;
    const toIndex = parseInt(strings.split(' to ')[1], 10) - 1;

    const movingStack = [];
    for (let i = 0; i < number; i += 1) {
      movingStack.push(stacks[fromIndex].pop());
    }

    for (let i = 0; i < number; i += 1) {
      stacks[toIndex].push(movingStack.pop());
    }
  });

stacks.reduce((string, stack) => `${string}${stack[stack.length - 1]}`, '');
