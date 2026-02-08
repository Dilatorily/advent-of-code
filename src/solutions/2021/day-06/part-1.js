const calculateFishes = (days, fishes) => {
  if (days === 0) {
    return fishes.length;
  }

  const newFishes = [];
  fishes.forEach((fish) => {
    if (fish === 0) {
      newFishes.push(6, 8);
    } else {
      newFishes.push(fish - 1);
    }
  });

  return calculateFishes(days - 1, newFishes);
};

console.log(
  calculateFishes(
    80,
    document
      .querySelector('pre')
      .textContent.split(',')
      .map((number) => parseInt(number, 10)),
  ),
);
