document
  .querySelector('pre')
  .textContent.split('\n')
  .map((number) => parseInt(number, 10))
  .reduce((count, currentMeasurement, index, measurements) => {
    if (index === 0 || index === 1 || index === 2) {
      return count;
    }

    if (
      measurements[index - 2] + measurements[index - 1] + currentMeasurement >
      measurements[index - 3] + measurements[index - 2] + measurements[index - 1]
    ) {
      return count + 1;
    }

    return count;
  }, 0);
