const crabs = document
  .querySelector('pre')
  .textContent.split(',')
  .map((number) => parseInt(number, 10))
  .sort((a, b) => a - b);

const median =
  crabs.length % 2 === 0
    ? (crabs[crabs.length / 2 - 1] + crabs[crabs.length / 2]) / 2
    : crabs[Math.round(crabs.length / 2)];

crabs.reduce((fuel, crab) => fuel + Math.abs(crab - median), 0);
