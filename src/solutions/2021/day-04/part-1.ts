interface Cell {
  marked: boolean;
  value: number;
}

const hasBingo = (board: Cell[][]) => {
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

export const solution = (lines: string[]) => {
  const numbers = lines[0].split(',').map((number) => parseInt(number, 10));

  const boards = lines.slice(1).reduce((b: Cell[][][], line) => {
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

  for (const number of numbers) {
    for (const board of boards) {
      for (const row of board) {
        for (const cell of row) {
          if (cell.value === number) {
            cell.marked = true;
          }
        }
      }

      if (hasBingo(board)) {
        let sum = 0;

        for (const row of board) {
          for (const cell of row) {
            if (!cell.marked) {
              sum += cell.value;
            }
          }
        }

        return sum * number;
      }
    }
  }

  throw new Error('No bingo winner!');
};
