const calculateFishes = (days: number, fishes: number[]) => {
  if (days === 0) {
    return fishes.reduce((a: number, b: number) => a + b, 0);
  }

  const newFishes = fishes.slice(1);
  newFishes[6] += fishes[0];
  newFishes.push(fishes[0]);

  return calculateFishes(days - 1, newFishes);
};

export const solution = (lines: string[]) =>
  calculateFishes(
    256,
    lines[0]
      .split(',')
      .map((number) => parseInt(number, 10))
      .reduce(
        (fishes: number[], fish) => {
          const newFishes = [...fishes];
          newFishes[fish] += 1;
          return newFishes;
        },
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ),
  );
