export const transposeMatrix = <T>(matrix: T[][]): T[][] =>
  matrix.reduce<T[][]>(
    (transposedMatrix, row) =>
      row.map((_, index) => [...(transposedMatrix[index] ?? []), row[index]]),
    [],
  );
