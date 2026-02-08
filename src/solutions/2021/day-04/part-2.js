const numbers = document
  .querySelector('pre')
  .textContent.split('\n')[0]
  .split(',')
  .map((number) => parseInt(number, 10));

const boards = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(1, -1)
  .reduce((b, line) => {
    if (line === '') {
      b.push([]);
      return b;
    }

    b[b.length - 1].push(
      line
        .split(' ')
        .filter((number) => number !== '')
        .map((number) => ({ marked: false, value: parseInt(number, 10) })),
    );
    return b;
  }, []);

const hasBingo = (board) => {
  if (
    board[0][0].marked &&
    board[0][1].marked &&
    board[0][2].marked &&
    board[0][3].marked &&
    board[0][4].marked
  ) {
    return true;
  }

  if (
    board[1][0].marked &&
    board[1][1].marked &&
    board[1][2].marked &&
    board[1][3].marked &&
    board[1][4].marked
  ) {
    return true;
  }

  if (
    board[2][0].marked &&
    board[2][1].marked &&
    board[2][2].marked &&
    board[2][3].marked &&
    board[2][4].marked
  ) {
    return true;
  }

  if (
    board[3][0].marked &&
    board[3][1].marked &&
    board[3][2].marked &&
    board[3][3].marked &&
    board[3][4].marked
  ) {
    return true;
  }

  if (
    board[4][0].marked &&
    board[4][1].marked &&
    board[4][2].marked &&
    board[4][3].marked &&
    board[4][4].marked
  ) {
    return true;
  }

  if (
    board[0][0].marked &&
    board[1][0].marked &&
    board[2][0].marked &&
    board[3][0].marked &&
    board[4][0].marked
  ) {
    return true;
  }

  if (
    board[0][1].marked &&
    board[1][1].marked &&
    board[2][1].marked &&
    board[3][1].marked &&
    board[4][1].marked
  ) {
    return true;
  }

  if (
    board[0][2].marked &&
    board[1][2].marked &&
    board[2][2].marked &&
    board[3][2].marked &&
    board[4][2].marked
  ) {
    return true;
  }

  if (
    board[0][3].marked &&
    board[1][3].marked &&
    board[2][3].marked &&
    board[3][3].marked &&
    board[4][3].marked
  ) {
    return true;
  }

  if (
    board[0][4].marked &&
    board[1][4].marked &&
    board[2][4].marked &&
    board[3][4].marked &&
    board[4][4].marked
  ) {
    return true;
  }

  return false;
};

const getScore = (n, b) => {
  const number = n[0];

  if (b.length === 1) {
    const board = b[0];

    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board[i].length; j += 1) {
        if (board[i][j].value === number) {
          board[i][j].marked = true;
        }
      }
    }

    if (!hasBingo(board)) {
      return getScore(n.slice(1), b);
    }

    let sum = 0;

    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board[i].length; j += 1) {
        if (!board[i][j].marked) {
          sum += board[i][j].value;
        }
      }
    }

    return sum * number;
  }

  const filteredBoards = [];
  for (let i = 0; i < b.length; i += 1) {
    const board = b[i];

    for (let j = 0; j < board.length; j += 1) {
      for (let k = 0; k < board[j].length; k += 1) {
        if (board[j][k].value === number) {
          board[j][k].marked = true;
        }
      }
    }

    if (!hasBingo(board)) {
      filteredBoards.push(board);
    }
  }

  return getScore(n.slice(1), filteredBoards);
};

console.log(getScore(numbers, boards));
