export const solution = (lines: string[]) => {
  const instructions = lines[0].split('');

  let floor = 0;
  let position = 0;

  for (let index = 0; index < instructions.length; index += 1) {
    if (instructions[index] === '(') {
      floor += 1;
    }

    if (instructions[index] === ')') {
      floor -= 1;
      if (floor === -1) {
        position = index + 1;
        break;
      }
    }
  }

  return position;
};
