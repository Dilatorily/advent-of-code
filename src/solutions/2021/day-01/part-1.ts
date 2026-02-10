export const solution = (lines: string[]) =>
  lines
    .map((number) => parseInt(number, 10))
    .reduce((count, currentMeasurement, index, measurements) => {
      if (index === 0) {
        return count;
      }

      if (currentMeasurement > measurements[index - 1]) {
        return count + 1;
      }

      return count;
    }, 0);
