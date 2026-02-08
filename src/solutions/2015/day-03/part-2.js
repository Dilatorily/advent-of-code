const map = { '0,0': 2 };
document
  .querySelector('pre')
  .textContent.split('')
  .reduce(
    (positions, instruction, index) => {
      const newPosition = [...positions[index % 2]];

      if (instruction === '^') {
        newPosition[1] += 1;
      }

      if (instruction === 'v') {
        newPosition[1] -= 1;
      }

      if (instruction === '<') {
        newPosition[0] -= 1;
      }

      if (instruction === '>') {
        newPosition[0] += 1;
      }

      const newPositionString = `${newPosition[0]},${newPosition[1]}`;
      map[newPositionString] = (map[newPositionString] || 0) + 1;
      return index % 2 === 0 ? [newPosition, positions[1]] : [positions[0], newPosition];
    },
    [
      [0, 0],
      [0, 0],
    ],
  );
console.log(Object.keys(map).length);
