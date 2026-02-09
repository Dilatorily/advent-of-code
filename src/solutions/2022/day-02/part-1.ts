const strategy: Record<string, number> = {
  'A X': 4,
  'A Y': 8,
  'A Z': 3,
  'B X': 1,
  'B Y': 5,
  'B Z': 9,
  'C X': 7,
  'C Y': 2,
  'C Z': 6,
};

export const solution = (lines: string[]) => {
  return lines
    .filter((line) => line.length > 0)
    .reduce((sum, scenario) => sum + (strategy[scenario] || 0), 0);
};
