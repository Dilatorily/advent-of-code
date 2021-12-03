document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((present) => present.split('x').map((number) => parseInt(number, 10)))
  .reduce((sum, [length, width, height]) => {
    const sides = [length * width, length * height, width * height];
    const extra = Math.min(...sides);
    return sum + sides[0] * 2 + sides[1] * 2 + sides[2] * 2 + extra;
  }, 0);
