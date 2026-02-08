const getNextNumberInSequence = (...sequence) => {
  const nextSequence = [];

  sequence.forEach((number, index, history) => {
    if (index === 0) {
      return;
    }

    nextSequence.push(number - history[index - 1]);
  });

  if (nextSequence.every((number) => number === 0)) {
    return sequence[sequence.length - 1];
  }

  return sequence[sequence.length - 1] + getNextNumberInSequence(...nextSequence);
};

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((history) =>
    getNextNumberInSequence(...history.split(' ').map((number) => Number.parseInt(number, 10))),
  )
  .reduce((a, b) => a + b);
