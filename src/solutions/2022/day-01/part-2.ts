export const solution = (lines: string[]): number => {
  return lines
    .join('\n')
    .split('\n\n')
    .map((numbers) =>
      numbers
        .split('\n')
        .filter((number) => number !== '')
        .map((number) => parseInt(number, 10))
        .reduce((sum, number) => sum + number, 0),
    )
    .sort((a, b) => b - a)
    .reduce((sum, calories, index) => (index < 3 ? sum + calories : sum), 0);
};
