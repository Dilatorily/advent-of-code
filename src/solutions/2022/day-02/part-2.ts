const strategy: Record<string, number> = {
  'A X': 3,
  'A Y': 4,
  'A Z': 8,
  'B X': 1,
  'B Y': 5,
  'B Z': 9,
  'C X': 2,
  'C Y': 6,
  'C Z': 7,
};

export const solution = (lines: string[]): number => {
  return lines
    .filter((line) => line.length > 0)
    .reduce((sum, scenario) => sum + (strategy[scenario] || 0), 0);
};
