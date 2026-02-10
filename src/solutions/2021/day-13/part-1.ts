export const solution = (lines: string[]) => {
  const coordinates = lines
    .filter((instruction) => instruction.includes(','))
    .map((instruction) => instruction.split(',').map((number) => parseInt(number, 10)));

  const folds = lines
    .filter((instruction) => instruction.includes('='))
    .map((line) => {
      const instruction = line.split(' ');
      return {
        direction: instruction[instruction.length - 1].split('=')[0],
        value: parseInt(instruction[instruction.length - 1].split('=')[1], 10),
      };
    });

  const { direction, value } = folds[0];
  return [
    ...new Set(
      coordinates.map(([x, y]) => {
        if (direction === 'x') {
          return `${x < value ? x : x - 2 * (x - value)},${y}`;
        }

        return `${x},${y < value ? y : y - 2 * (y - value)}`;
      }),
    ),
  ].length;
};
