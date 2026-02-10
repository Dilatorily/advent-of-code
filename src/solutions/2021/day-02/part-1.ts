export const solution = (lines: string[]) =>
  lines
    .map((command) => command.split(' '))
    .map<[string, number]>(([direction, value]) => [direction, parseInt(value, 10)])
    .reduce(
      ([horizontal, depth], [direction, value]) => {
        if (direction === 'forward') {
          return [horizontal + value, depth];
        }

        if (direction === 'up') {
          return [horizontal, depth - value];
        }

        if (direction === 'down') {
          return [horizontal, depth + value];
        }

        return [horizontal, depth];
      },
      [0, 0],
    )
    .reduce((a, b) => a * b, 1);
