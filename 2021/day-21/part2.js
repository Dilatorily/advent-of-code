const cachedWins = (() => {
  const cache = {};

  [...Array(10)].forEach((...[, i]) => {
    cache[i + 1] = {};
    [...Array(10)].forEach((...[, j]) => {
      cache[i + 1][j + 1] = {};
      [...Array(21)].forEach((...[, k]) => {
        cache[i + 1][j + 1][k] = {};
      });
    });
  });

  return cache;
})();

const rollsFrequencies = (() => {
  const cache = {};

  [...Array(3)].forEach((...[, i]) => {
    [...Array(3)].forEach((...[, j]) => {
      [...Array(3)].forEach((...[, k]) => {
        cache[i + j + k + 3] = (cache[i + j + k + 3] || 0) + 1;
      });
    });
  });

  return cache;
})();

const updatePositions = (position, board = 10) => ((position - 1) % board) + 1;

const playTurn = ([position1, position2], win, [score1, score2] = [0, 0]) => {
  if (cachedWins[position1][position2][score1][score2]) {
    return cachedWins[position1][position2][score1][score2];
  }

  if (score1 >= win) {
    return [1, 0];
  }

  if (score2 >= win) {
    return [0, 1];
  }

  let wins = [0, 0];

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

const findMostWins = (positions, win = 21) => Math.max(...playTurn(positions, win));

const positions = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((position) => parseInt(position.split(': ')[1], 10));

findMostWins(positions);
