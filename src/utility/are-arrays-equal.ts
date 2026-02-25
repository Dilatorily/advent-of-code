export const areArraysEqual = <T>(
  array1: T[],
  array2: T[],
  comparator = (value1: T, value2: T) => value1 === value2,
) =>
  array1.length === array2.length &&
  array1.every((value, index) => comparator(value, array2[index]));
