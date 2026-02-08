const heightMap = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((row) => row.split('').map((number) => parseInt(number, 10)));

const lows = [];

heightMap.forEach((row, rowIndex) => {
  row.forEach((cell, columnIndex) => {
    if (rowIndex === 0 && columnIndex === 0) {
      if (cell < row[columnIndex + 1] && cell < heightMap[rowIndex + 1][columnIndex]) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (rowIndex === 0 && columnIndex === row.length - 1) {
      if (cell < row[columnIndex - 1] && cell < heightMap[rowIndex + 1][columnIndex]) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (rowIndex === heightMap.length - 1 && columnIndex === 0) {
      if (cell < row[columnIndex + 1] && cell < heightMap[rowIndex - 1][columnIndex]) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (rowIndex === heightMap.length - 1 && columnIndex === row.length - 1) {
      if (cell < row[columnIndex - 1] && cell < heightMap[rowIndex - 1][columnIndex]) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (rowIndex === 0) {
      if (
        cell < row[columnIndex - 1] &&
        cell < row[columnIndex + 1] &&
        cell < heightMap[rowIndex + 1][columnIndex]
      ) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (rowIndex === heightMap.length - 1) {
      if (
        cell < row[columnIndex - 1] &&
        cell < row[columnIndex + 1] &&
        cell < heightMap[rowIndex - 1][columnIndex]
      ) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (columnIndex === 0) {
      if (
        cell < row[columnIndex + 1] &&
        cell < heightMap[rowIndex - 1][columnIndex] &&
        cell < heightMap[rowIndex + 1][columnIndex]
      ) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }
    if (columnIndex === row.length - 1) {
      if (
        cell < row[columnIndex - 1] &&
        cell < heightMap[rowIndex - 1][columnIndex] &&
        cell < heightMap[rowIndex + 1][columnIndex]
      ) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
      return;
    }

    if (
      cell < row[columnIndex - 1] &&
      cell < row[columnIndex + 1] &&
      cell < heightMap[rowIndex - 1][columnIndex] &&
      cell < heightMap[rowIndex + 1][columnIndex]
    ) {
      lows.push({ column: columnIndex, row: rowIndex });
    }
  });
});

lows.reduce((sum, { column, row }) => sum + heightMap[row][column] + 1, 0);
