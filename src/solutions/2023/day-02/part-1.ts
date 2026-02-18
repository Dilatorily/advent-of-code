const limits = {
  blue: 14,
  green: 13,
  red: 12,
};

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
    .reduce((sum, game, gameIndex) => {
      if (
        game.every(
          (subset) =>
            parseInt(subset.red || '0', 10) <= limits.red &&
            parseInt(subset.green || '0', 10) <= limits.green &&
            parseInt(subset.blue || '0', 10) <= limits.blue,
        )
      ) {
        return sum + gameIndex + 1;
      }

      return sum;
    }, 0);
