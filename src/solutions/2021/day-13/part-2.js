let coordinates = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter((instruction) => instruction.includes(','))
  .map((instruction) => instruction.split(',').map((number) => parseInt(number, 10)));

const folds = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter((instruction) => instruction.includes('='))
  .map((line) => {
    const instruction = line.split(' ');
    return {
      direction: instruction[instruction.length - 1].split('=')[0],
      value: instruction[instruction.length - 1].split('=')[1],
    };
  });

folds.forEach(({ direction, value }) => {
  coordinates = [
    ...new Set(
      coordinates.map(([x, y]) => {
        if (direction === 'x') {
          return `${x < value ? x : x - 2 * (x - value)},${y}`;
        }

        return `${x},${y < value ? y : y - 2 * (y - value)}`;
      }),
    ),
  ].map((instruction) => instruction.split(',').map((number) => parseInt(number, 10)));
});

const maximums = coordinates.reduce(
  ([maxX, maxY], [x, y]) => [Math.max(maxX, x + 1), Math.max(maxY, y + 1)],
  [0, 0],
);
const grid = [...Array(maximums[1])].map(() => Array(maximums[0]).fill('.'));

coordinates.forEach(([x, y]) => {
  grid[y][x] = '#';
});

console.log(grid);
