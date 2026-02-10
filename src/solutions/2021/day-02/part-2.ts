export const solution = (lines: string[]) =>
  lines
    .map((command) => command.split(' '))
    .map<[string, number]>(([direction, value]) => [direction, parseInt(value, 10)])
    .reduce(
      ([horizontal, depth, aim], [direction, value]) => {
        if (direction === 'forward') {
          return [horizontal + value, depth + aim * value, aim];
        }

        if (direction === 'up') {
          return [horizontal, depth, aim - value];
        }

        if (direction === 'down') {
          return [horizontal, depth, aim + value];
        }

        return [horizontal, depth, aim];
      },
      [0, 0, 0],
    )
    .slice(0, -1)
    .reduce((a, b) => a * b, 1);
