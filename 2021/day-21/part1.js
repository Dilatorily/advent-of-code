const rollToSpaces = (roll, dice = 100) => ((roll - 1) % dice) + 1;
const turnToSpaces = (turn) =>
  rollToSpaces(turn * 3 - 2) + rollToSpaces(turn * 3 - 1) + rollToSpaces(turn * 3);

const updatePositions = (position, board = 10) => ((position - 1) % board) + 1;

const playGame = ([initialPosition1, initialPosition2], win = 1000) => {
  const scores = [0, 0];
  const positions = [initialPosition1, initialPosition2];
  let turn = 0;

  while (Math.max(...scores) < win) {
    const player = turn % 2;
    turn += 1;
    positions[player] = updatePositions(positions[player] + turnToSpaces(turn));
    scores[player] += positions[player];
  }

  return Math.min(...scores) * turn * 3;
};

const positions = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((position) => parseInt(position.split(': ')[1], 10));

playGame(positions);
