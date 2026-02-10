export const solution = (lines: string[]) => {
  const crabs = lines[0]
    .split(',')
    .map((number) => parseInt(number, 10))
    .sort((a, b) => a - b);

  const average = crabs.reduce((a, b) => a + b, 0) / crabs.length;
  const getFuel = (distance: number) => (distance * (distance + 1)) / 2;
  return Math.min(
    crabs.reduce((fuel, crab) => fuel + getFuel(Math.abs(crab - Math.floor(average))), 0),
    crabs.reduce((fuel, crab) => fuel + getFuel(Math.abs(crab - Math.ceil(average))), 0),
  );
};
