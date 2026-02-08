document
  .querySelector('pre')
  .textContent.split('')
  .reduce((floor, instruction) => {
    if (instruction === '(') {
      return floor + 1;
    }

    if (instruction === ')') {
      return floor - 1;
    }

    return floor;
  }, 0);
