export const solution = (lines: string[]) => {
  const instructions = lines[0].split('');

  return instructions.reduce((floor, instruction) => {
    if (instruction === '(') {
      return floor + 1;
    }

    if (instruction === ')') {
      return floor - 1;
    }

    return floor;
  }, 0);
};
