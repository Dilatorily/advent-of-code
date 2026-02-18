import { fillArray } from '#dilatorily/advent-of-code/utility/fill-array';
import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const executeInstruction = (instruction: string, lights: number[][]) => {
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
        lights[x][y] += 1;
      } else if (instruction.startsWith('turn off') && lights[x][y] > 0) {
        lights[x][y] -= 1;
      } else if (instruction.startsWith('toggle')) {
        lights[x][y] += 2;
      }
    }
  }
};

export const solution = (lines: string[]) => {
  const lights = fillArray(1000, fillArray(1000, 0));
  lines.forEach((line) => {
    executeInstruction(line, lights);
  });

  return lights.reduce((brightness, row) => brightness + row.reduce(sum, 0), 0);
};
