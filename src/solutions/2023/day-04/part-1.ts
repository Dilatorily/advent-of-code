export const solution = (lines: string[]) =>
  lines
    .map((card) => {
      const [winningNumbers, numbers] = card
        .split(': ')[1]
        .split(' | ')
        .map((cardDetails) =>
          cardDetails
            .split(' ')
            .filter(Boolean)
            .map((number) => Number.parseInt(number, 10)),
        );

      const amountOfWinningNumbers = numbers.filter((number) =>
        winningNumbers.includes(number),
      ).length;

      return amountOfWinningNumbers === 0 ? 0 : 2 ** (amountOfWinningNumbers - 1);
    })
    .reduce((sum, value) => sum + value, 0);
