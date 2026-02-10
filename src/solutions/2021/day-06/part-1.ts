const calculateFishes = (days: number, fishes: number[]) => {
  if (days === 0) {
    return fishes.length;
  }

  const newFishes: number[] = [];
  fishes.forEach((fish) => {
    if (fish === 0) {
      newFishes.push(6, 8);
    } else {
      newFishes.push(fish - 1);
    }
  });

  return calculateFishes(days - 1, newFishes);
};

export const solution = (lines: string[]) =>
  calculateFishes(
    80,
    lines[0].split(',').map((number) => parseInt(number, 10)),
  );
