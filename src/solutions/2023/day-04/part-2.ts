export const solution = (lines: string[]) => {
  const cards = lines.map((card) =>
    card
      .split(': ')[1]
      .split(' | ')
      .map((cardDetails) =>
        cardDetails
          .split(' ')
          .filter(Boolean)
          .map((number) => Number.parseInt(number, 10)),
      ),
  );
  const cardTotals: number[] = Array(cards.length).fill(1) as number[];

  cards.forEach(([winningNumbers, numbers], index) => {
    const amountOfWinningNumbers = numbers.filter((number) =>
      winningNumbers.includes(number),
    ).length;

    for (let i = 0; i < amountOfWinningNumbers; i += 1) {
      if (index + 1 + i < cards.length) {
        cardTotals[index + 1 + i] += cardTotals[index];
      }
    }
  });

  return cardTotals.reduce((sum, value) => sum + value, 0);
};
