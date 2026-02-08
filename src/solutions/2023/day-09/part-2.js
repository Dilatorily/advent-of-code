const getPreviousNumberInSequence = (...sequence) => {
  const nextSequence = [];

  sequence.forEach((number, index, history) => {
    if (index === 0) {
      return;
    }

    nextSequence.push(number - history[index - 1]);
  });

  if (nextSequence.every((number) => number === 0)) {
    return sequence[0];
  }

  return sequence[0] - getPreviousNumberInSequence(...nextSequence);
};

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((history) =>
    getPreviousNumberInSequence(...history.split(' ').map((number) => Number.parseInt(number, 10))),
  )
  .reduce((a, b) => a + b);
