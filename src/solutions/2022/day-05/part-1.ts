const parseStacks = (lines: string[]) => {
  const stackLines: string[] = [];
  let lineIndex = 0;

  // Collect all lines until we hit the empty line
  while (lineIndex < lines.length && lines[lineIndex].trim() !== '') {
    stackLines.push(lines[lineIndex]);
    lineIndex += 1;
  }

  // Parse the stack numbers line to determine how many stacks we have
  const numbersLine = lines[lineIndex - 1];
  const numStacks = numbersLine.trim().split(/\s+/).length;

  // Initialize empty stacks
  const stacks: string[][] = Array.from({ length: numStacks }, () => []);

  // Parse stack lines from bottom to top (excluding the numbers line)
  for (let i = stackLines.length - 1; i >= 0; i -= 1) {
    const line = stackLines[i];
    for (let stackIndex = 0; stackIndex < numStacks; stackIndex += 1) {
      // Each stack is 4 characters wide (positions 0-3, 4-7, 8-11, etc.)
      const crate = line[stackIndex * 4 + 1];
      if (crate && crate !== ' ') {
        stacks[stackIndex].push(crate);
      }
    }
  }

  return stacks;
};

export const solution = (lines: string[]) => {
  const stacks = parseStacks(lines);

  // Find where the moves start (after the empty line following the stack numbers)
  let moveStartIndex = 0;
  while (moveStartIndex < lines.length && !/^\s*1/.exec(lines[moveStartIndex])) {
    moveStartIndex += 1;
  }
  // Skip the numbers line and the empty line
  moveStartIndex += 2;

  lines
    .slice(moveStartIndex)
    .filter((line) => line.length > 0)
    .forEach((move) => {
      let strings = move.split('move ')[1];
      const number = parseInt(strings.split(' from ')[0], 10);
      [, strings] = strings.split(' from ');
      const fromIndex = parseInt(strings.split(' to ')[0], 10) - 1;
      const toIndex = parseInt(strings.split(' to ')[1], 10) - 1;

      for (let i = 0; i < number; i += 1) {
        const item = stacks[fromIndex].pop();
        if (item) {
          stacks[toIndex].push(item);
        }
      }
    });

  return stacks.reduce((string, stack) => `${string}${stack[stack.length - 1]}`, '');
};
