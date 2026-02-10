const cachedWins = (() => {
  const cache: Record<
    number,
    Record<number, Record<number, Record<number, [number, number] | undefined>>>
  > = {};

  Array.from({ length: 10 }, (_, i) => {
    cache[i + 1] = {};
    Array.from({ length: 10 }, (_, j) => {
      cache[i + 1][j + 1] = {};
      Array.from({ length: 21 }, (_, k) => {
        cache[i + 1][j + 1][k] = {};
      });
    });
  });

  return cache;
})();

const rollsFrequencies = (() => {
  const cache: Record<number, number> = {};

  Array.from({ length: 3 }, (_, i) => {
    Array.from({ length: 3 }, (_, j) => {
      Array.from({ length: 3 }, (_, k) => {
        cache[i + j + k + 3] = (cache[i + j + k + 3] || 0) + 1;
      });
    });
  });

  return cache;
})();

const updatePositions = (position: number, board = 10) => ((position - 1) % board) + 1;

const playTurn = (
  [position1, position2]: [number, number],
  win: number,
  [score1, score2]: [number, number] = [0, 0],
) => {
  if (cachedWins[position1][position2][score1][score2]) {
    return cachedWins[position1][position2][score1][score2];
  }

  if (score1 >= win) {
    return [1, 0];
  }

  if (score2 >= win) {
    return [0, 1];
  }

  let wins: [number, number] = [0, 0];

  Object.entries(rollsFrequencies)
    .map(([roll, frequency]) => [parseInt(roll, 10), frequency])
    .forEach(([roll, frequency]) => {
      const newPosition1 = updatePositions(position1 + roll);
      const newScore1 = score1 + newPosition1;

      const [wins2, wins1] = playTurn([position2, newPosition1], win, [score2, newScore1]);

      wins = [wins[0] + wins1 * frequency, wins[1] + wins2 * frequency];
    });

  cachedWins[position1][position2][score1][score2] = wins;
  return wins;
};

const findMostWins = (positions: [number, number], win = 21) =>
  Math.max(...playTurn(positions, win));

export const solution = (lines: string[]) => {
  const positions = lines.map((position) => parseInt(position.split(': ')[1], 10)) as [
    number,
    number,
  ];

  return findMostWins(positions);
};
