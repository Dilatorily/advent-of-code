const strategy = {
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

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .reduce((sum, scenario) => sum + strategy[scenario], 0);
