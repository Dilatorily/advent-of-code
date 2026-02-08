const calculateFishes = (days, fishes) => {
  if (days === 0) {
    return fishes.reduce((a, b) => a + b, 0);
  }

  const newFishes = fishes.slice(1);
  newFishes[6] += fishes[0];
  newFishes.push(fishes[0]);

  return calculateFishes(days - 1, newFishes);
};

console.log(
  calculateFishes(
    256,
    document
      .querySelector('pre')
      .textContent.split(',')
      .map((number) => parseInt(number, 10))
      .reduce(
        (fishes, fish) => {
          const newFishes = [...fishes];
          newFishes[fish] += 1;
          return newFishes;
        },
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ),
  ),
);
