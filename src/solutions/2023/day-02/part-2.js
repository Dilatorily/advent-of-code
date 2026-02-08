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
  .reduce((sum, game) => {
    const minimums = { red: 0, green: 0, blue: 0 };

    game.forEach((subset) => {
      minimums.red = Math.max(minimums.red, subset.red ?? 0);
      minimums.green = Math.max(minimums.green, subset.green ?? 0);
      minimums.blue = Math.max(minimums.blue, subset.blue ?? 0);
    });

    const power = minimums.red * minimums.green * minimums.blue;
    return sum + power;
  }, 0);
