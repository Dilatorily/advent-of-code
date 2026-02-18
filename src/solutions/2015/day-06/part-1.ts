import { fillArray } from '#dilatorily/advent-of-code/utility/fill-array';
import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const executeInstruction = (instruction: string, lights: boolean[][]) => {
  const x1 = toNumber(
    instruction.split(',')[0].split(' ')[instruction.split(',')[0].split(' ').length - 1],
  );
  const y1 = toNumber(instruction.split(',')[1].split(' ')[0]);
  const x2 = toNumber(instruction.split(',')[1].split(' ')[2]);
  const y2 = toNumber(instruction.split(',')[2]);

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      if (instruction.startsWith('turn on')) {
        lights[x][y] = true;
      } else if (instruction.startsWith('turn off')) {
        lights[x][y] = false;
      } else if (instruction.startsWith('toggle')) {
        lights[x][y] = !lights[x][y];
      }
    }
  }
};

export const solution = (lines: string[]) => {
  const lights = fillArray(1000, fillArray(1000, false));
  lines.forEach((line) => {
    executeInstruction(line, lights);
  });

  return lights.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
};
