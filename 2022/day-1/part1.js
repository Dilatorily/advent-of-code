Math.max(
  ...document
    .querySelector('pre')
    .textContent.split('\n\n')
    .map((numbers) =>
      numbers
        .split('\n')
        .filter((number) => number !== '')
        .map((number) => parseInt(number, 10))
        .reduce((sum, number) => sum + number, 0),
    ),
);
