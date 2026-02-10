export const solution = (lines: string[]) =>
  lines
    .map((string) =>
      string
        .split(': ')[1]
        .split('; ')
        .map((game) =>
          game.split(', ').reduce<Record<string, string>>(
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
        minimums.red = Math.max(minimums.red, parseInt(subset.red || '0', 10));
        minimums.green = Math.max(minimums.green, parseInt(subset.green || '0', 10));
        minimums.blue = Math.max(minimums.blue, parseInt(subset.blue || '0', 10));
      });

      const power = minimums.red * minimums.green * minimums.blue;
      return sum + power;
    }, 0);
