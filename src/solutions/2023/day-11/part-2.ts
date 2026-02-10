interface Galaxy {
  column: number;
  row: number;
}

export const solution = (lines: string[], expansion = 1000000) => {
  const image = lines.map((row) => row.split(''));

  const expandedRows: number[] = [];
  const expandedColumns: number[] = [];
  const galaxies: Galaxy[] = [];

  image.forEach((row, rowIndex) => {
    if (row.every((cell) => cell === '.')) {
      expandedRows.push(rowIndex);
    }

    row.forEach((cell, columnIndex) => {
      if (cell === '#') {
        galaxies.push({ column: columnIndex, row: rowIndex });
      }
    });
  });

  image[0].forEach((_, index) => {
    if (image.map((row) => row[index]).every((cell) => cell === '.')) {
      expandedColumns.push(index);
    }
  });

  let sum = 0;
  galaxies.forEach((galaxy1, index1) => {
    galaxies.forEach((galaxy2, index2) => {
      if (index2 > index1) {
        const columnDistance =
          Math.abs(galaxy2.column - galaxy1.column) +
          expandedColumns.filter(
            (column) =>
              column < Math.max(galaxy2.column, galaxy1.column) &&
              column > Math.min(galaxy2.column, galaxy1.column),
          ).length *
            (expansion - 1);
        const rowDistance =
          Math.abs(galaxy2.row - galaxy1.row) +
          expandedRows.filter(
            (row) =>
              row < Math.max(galaxy2.row, galaxy1.row) && row > Math.min(galaxy2.row, galaxy1.row),
          ).length *
            (expansion - 1);
        sum += columnDistance + rowDistance;
      }
    });
  });

  return sum;
};
