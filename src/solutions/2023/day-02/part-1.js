const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((string) =>
    string
      .split(': ')[1]
      .split('; ')
      .map((game) =>
        game.split(', ').reduce(
          (previousValue, currentValue) =>
            Object.assign(previousValue, {
              [currentValue.split(' ')[1]]: currentValue.split(' ')[0],
            }),
          {},
        ),
      ),
  )
  .reduce((sum, game, gameIndex) => {
    if (
      game.every(
        (subset) =>
          (subset.red ?? 0) <= limits.red &&
          (subset.green ?? 0) <= limits.green &&
          (subset.blue ?? 0) <= limits.blue,
      )
    ) {
      return sum + gameIndex + 1;
    }

    return sum;
  }, 0);
