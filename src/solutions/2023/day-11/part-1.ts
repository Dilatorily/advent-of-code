interface Galaxy {
  column: number;
  row: number;
}

export const solution = (lines: string[]) => {
  const image = lines.map((row) => row.split(''));

  const expandedRows: string[][] = [];
  const expandedImage: string[][] = [];
  const galaxies: Galaxy[] = [];

  image.forEach((row) => {
    if (row.every((cell) => cell === '.')) {
      expandedRows.push([...row]);
      expandedImage.push([]);
    }
    expandedRows.push([...row]);
    expandedImage.push([]);
  });

  expandedRows[0].forEach((_, columnIndex) => {
    if (expandedRows.map((row) => row[columnIndex]).every((cell) => cell === '.')) {
      expandedImage.forEach((row) => row.push('.'));
    }
    expandedImage.forEach((row, rowIndex) => {
      const cell = expandedRows[rowIndex][columnIndex];
      row.push(cell);

      if (cell === '#') {
        galaxies.push({ column: row.length - 1, row: rowIndex });
      }
    });
  });

  let sum = 0;
  galaxies.forEach((galaxy1, index1) => {
    galaxies.forEach((galaxy2, index2) => {
      if (index2 > index1) {
        sum += Math.abs(galaxy2.column - galaxy1.column) + Math.abs(galaxy2.row - galaxy1.row);
      }
    });
  });

  return sum;
};
