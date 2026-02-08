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

const getMaximum = (initialVelocity, area) => {
  let position = 0;
  let velocity = initialVelocity[1];
  let maximum = position;

  while (position >= area[1][0]) {
    if (position > maximum) {
      maximum = position;
    }

    position += velocity;
    velocity -= 1;
  }

  return maximum;
};

const findTotalVelocities = (area) => {
  const minimumX = Math.min(
    ...[-(1 / 2) + Math.sqrt(1 / 4 + 2 * area[0][0]), -(1 / 2) - Math.sqrt(1 / 4 + 2 * area[0][0])]
      .filter((minimum) => minimum > 0)
      .map((minimum) => Math.floor(minimum)),
  );
  let maximum = 2;
  let total = 0;

  for (let i = minimumX; i <= area[0][1]; i += 1) {
    for (let j = area[1][0]; j <= maximum; j += 1) {
      if (willIntersectArea([i, j], area)) {
        total += 1;

        const currentMaximum = getMaximum([i, j], area);
        if (currentMaximum > maximum) {
          maximum = currentMaximum;
        }
      }
    }
  }
  return total;
};

findTotalVelocities([x, y]);
