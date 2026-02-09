export const solution = (lines: string[]) => {
  const map: Record<string, number> = { '0,0': 1 };

  lines[0].split('').reduce(
    (position, instruction) => {
      const newPosition = [...position];

      if (instruction === '^') {
        newPosition[1] += 1;
      }

      if (instruction === 'v') {
        newPosition[1] -= 1;
      }

      if (instruction === '<') {
        newPosition[0] -= 1;
      }

      if (instruction === '>') {
        newPosition[0] += 1;
      }

      const newPositionString = `${newPosition[0]},${newPosition[1]}`;
      map[newPositionString] = (map[newPositionString] || 0) + 1;
      return newPosition;
    },
    [0, 0],
  );

  return Object.keys(map).length;
};
