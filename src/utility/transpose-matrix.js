export default (matrix) =>
  matrix.reduce(
    (transposedMatrix, row) =>
      row.map((_, index) => [...(transposedMatrix[index] ?? []), row[index]]),
    [],
  );
