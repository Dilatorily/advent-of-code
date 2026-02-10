const getNextNumberInSequence = (...sequence: number[]): number => {
  const nextSequence: number[] = [];

  sequence.forEach((number, index, history) => {
    if (index === 0) {
      return;
    }

    nextSequence.push(number - history[index - 1]);
  });

  if (nextSequence.every((number) => number === 0)) {
    return sequence[sequence.length - 1];
  }

  return sequence[sequence.length - 1] + getNextNumberInSequence(...nextSequence);
};

export const solution = (lines: string[]) =>
  lines
    .map((history) =>
      getNextNumberInSequence(...history.split(' ').map((number) => Number.parseInt(number, 10))),
    )
    .reduce((a, b) => a + b, 0);
