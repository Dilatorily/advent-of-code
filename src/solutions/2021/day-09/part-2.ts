export const solution = (lines: string[]) => {
  const heightMap = lines.map((row) =>
    row.split('').map<{
      basin: number | undefined;
      depth: number;
    }>((number) => ({ depth: parseInt(number, 10), basin: undefined })),
  );

  const lows: { column: number; row: number }[] = [];
  const basins: number[] = [];

  heightMap.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (rowIndex === 0 && columnIndex === 0) {
        if (
          cell.depth < row[columnIndex + 1].depth &&
          cell.depth < heightMap[rowIndex + 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (rowIndex === 0 && columnIndex === row.length - 1) {
        if (
          cell.depth < row[columnIndex - 1].depth &&
          cell.depth < heightMap[rowIndex + 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (rowIndex === heightMap.length - 1 && columnIndex === 0) {
        if (
          cell.depth < row[columnIndex + 1].depth &&
          cell.depth < heightMap[rowIndex - 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (rowIndex === heightMap.length - 1 && columnIndex === row.length - 1) {
        if (
          cell.depth < row[columnIndex - 1].depth &&
          cell.depth < heightMap[rowIndex - 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (rowIndex === 0) {
        if (
          cell.depth < row[columnIndex - 1].depth &&
          cell.depth < row[columnIndex + 1].depth &&
          cell.depth < heightMap[rowIndex + 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (rowIndex === heightMap.length - 1) {
        if (
          cell.depth < row[columnIndex - 1].depth &&
          cell.depth < row[columnIndex + 1].depth &&
          cell.depth < heightMap[rowIndex - 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (columnIndex === 0) {
        if (
          cell.depth < row[columnIndex + 1].depth &&
          cell.depth < heightMap[rowIndex - 1][columnIndex].depth &&
          cell.depth < heightMap[rowIndex + 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }
      if (columnIndex === row.length - 1) {
        if (
          cell.depth < row[columnIndex - 1].depth &&
          cell.depth < heightMap[rowIndex - 1][columnIndex].depth &&
          cell.depth < heightMap[rowIndex + 1][columnIndex].depth
        ) {
          lows.push({ column: columnIndex, row: rowIndex });
        }
        return;
      }

      if (
        cell.depth < row[columnIndex - 1].depth &&
        cell.depth < row[columnIndex + 1].depth &&
        cell.depth < heightMap[rowIndex - 1][columnIndex].depth &&
        cell.depth < heightMap[rowIndex + 1][columnIndex].depth
      ) {
        lows.push({ column: columnIndex, row: rowIndex });
      }
    });
  });

  const calculateBasinSize = (
    coordinates: { column: number; row: number },
    basin: number,
  ): number => {
    if (coordinates.row < 0 || coordinates.row >= heightMap.length) {
      return 0;
    }

    if (coordinates.column < 0 || coordinates.column >= heightMap[coordinates.row].length) {
      return 0;
    }

    if (heightMap[coordinates.row][coordinates.column].basin != null) {
      return 0;
    }

    if (heightMap[coordinates.row][coordinates.column].depth === 9) {
      return 0;
    }

    heightMap[coordinates.row][coordinates.column].basin = basin;
    return (
      1 +
      calculateBasinSize({ column: coordinates.column - 1, row: coordinates.row }, basin) +
      calculateBasinSize({ column: coordinates.column + 1, row: coordinates.row }, basin) +
      calculateBasinSize({ column: coordinates.column, row: coordinates.row - 1 }, basin) +
      calculateBasinSize({ column: coordinates.column, row: coordinates.row + 1 }, basin)
    );
  };

  lows.forEach((low) => {
    const basin = calculateBasinSize(low, basins.length);

    if (basin > 0) {
      basins.push(basin);
    }
  });

  return basins
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1);
};
