export default function transposeMatrix<T>(matrix: T[][]): T[][] {
  return matrix.reduce(
    (transposedMatrix, row) =>
      row.map((_, index) => [...(transposedMatrix[index] ?? []), row[index]]),
    [] as T[][],
  );
}
