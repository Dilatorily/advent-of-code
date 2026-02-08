const initializeRegion = (x, y, z) => {
  const region = {};

  for (let i = x[0]; i <= x[1]; i += 1) {
    region[i] = {};
    for (let j = y[0]; j <= y[1]; j += 1) {
      region[i][j] = {};
      for (let k = z[0]; k <= z[1]; k += 1) {
        region[i][j][k] = false;
      }
    }
  }

  return region;
};

const reboot = (
  steps,
  boundaries = [
    [-50, 50],
    [-50, 50],
    [-50, 50],
  ],
) => {
  const region = initializeRegion(...boundaries);

  steps.forEach(({ power, x, y, z }) => {
    for (let i = x[0]; i <= x[1]; i += 1) {
      if (i >= boundaries[0][0] && i <= boundaries[0][1]) {
        for (let j = y[0]; j <= y[1]; j += 1) {
          if (j >= boundaries[1][0] && j <= boundaries[1][1]) {
            for (let k = z[0]; k <= z[1]; k += 1) {
              if (k >= boundaries[2][0] && k <= boundaries[2][1]) {
                region[i][j][k] = power;
              }
            }
          }
        }
      }
    }
  });

  return Object.values(region).flatMap((x) =>
    Object.values(x).flatMap((y) => Object.values(y).filter((z) => z)),
  ).length;
};

const steps = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((step) => {
    const power = step.split(' ')[0] === 'on' ? 1 : 0;
    const x = step
      .split('x=')[1]
      .split(',')[0]
      .split('..')
      .map((number) => parseInt(number, 10));
    const y = step
      .split('y=')[1]
      .split(',')[0]
      .split('..')
      .map((number) => parseInt(number, 10));
    const z = step
      .split('z=')[1]
      .split(',')[0]
      .split('..')
      .map((number) => parseInt(number, 10));
    return { power, x, y, z };
  });

reboot(steps);
