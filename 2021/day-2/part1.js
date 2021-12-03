document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((command) => command.split(' '))
  .map(([direction, value]) => [direction, parseInt(value, 10)])
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
