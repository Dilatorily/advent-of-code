export const solution = (lines: string[]): number => {
  return lines
    .filter((line) => line.length > 0)
    .map((pair) => {
      const elves = pair
        .split(',')
        .map((elf) => elf.split('-').map((number) => parseInt(number, 10)));

      return (
        (elves[0][0] <= elves[1][0] && elves[0][1] >= elves[1][1]) ||
        (elves[1][0] <= elves[0][0] && elves[1][1] >= elves[0][1])
      );
    })
    .reduce((sum, containsOtherPair) => (containsOtherPair ? sum + 1 : sum), 0);
};
