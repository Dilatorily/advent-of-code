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

(() => {
  for (let i = 0; i < numbers.length; i += 1) {
    const number = numbers[i];

    for (let j = 0; j < boards.length; j += 1) {
      const board = boards[j];

      for (let k = 0; k < board.length; k += 1) {
        for (let l = 0; l < board[k].length; l += 1) {
          if (board[k][l].value === number) {
            board[k][l].marked = true;
          }
        }
      }

      if (hasBingo(board)) {
        let sum = 0;

        for (let k = 0; k < board.length; k += 1) {
          for (let l = 0; l < board[k].length; l += 1) {
            if (!board[k][l].marked) {
              sum += board[k][l].value;
            }
          }
        }

        return sum * number;
      }
    }
  }

  throw new Error('No bingo winner!');
})();
