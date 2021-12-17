const x = document
  .querySelector('pre')
  .textContent.split(',')[0]
  .split('x=')[1]
  .split('..')
  .map((number) => parseInt(number, 10))
  .sort((a, b) => a - b);
const y = document
  .querySelector('pre')
  .textContent.split(',')[1]
  .split('y=')[1]
  .split('..')
  .map((number) => parseInt(number, 10))
  .sort((a, b) => a - b);

const willIntersectArea = (initialVelocity, area) => {
  const position = [0, 0];
  const velocity = [...initialVelocity];

  while (position[0] <= area[0][1] && position[1] >= area[1][0]) {
    if (position[0] >= area[0][0] && position[1] <= area[1][1]) {
      return true;
    }

    position[0] += velocity[0];
    position[1] += velocity[1];
    velocity[1] -= 1;

    if (velocity[0] > 0) {
      velocity[0] -= 1;
    } else if (velocity[0] < 0) {
      velocity[0] += 1;
    }
  }

  return false;
};

const findTotalVelocities = (area) => {
  let total = 0;
  for (let i = 0; i <= area[0][1]; i += 1) {
    for (let j = area[1][0]; j < 1000; j += 1) {
      if (willIntersectArea([i, j], area)) {
        total += 1;
      }
    }
  }
  return total;
};

findTotalVelocities([x, y]);
