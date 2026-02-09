export const solution = (lines: string[]) => {
  return Math.max(
    ...lines
      .join('\n')
      .split('\n\n')
      .map((numbers) =>
        numbers
          .split('\n')
          .filter((number) => number !== '')
          .map((number) => parseInt(number, 10))
          .reduce((sum, number) => sum + number, 0),
      ),
  );
};
