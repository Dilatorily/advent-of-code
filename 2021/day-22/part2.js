const cubeVolume = (x, y, z) => (x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1);

const intersectionCube = (cube1, cube2) => {
  const cube = {
    power: -cube2.power,
    x: [Math.max(cube1.x[0], cube2.x[0]), Math.min(cube1.x[1], cube2.x[1])],
    y: [Math.max(cube1.y[0], cube2.y[0]), Math.min(cube1.y[1], cube2.y[1])],
    z: [Math.max(cube1.z[0], cube2.z[0]), Math.min(cube1.z[1], cube2.z[1])],
  };

  if (cube.x[0] <= cube.x[1] && cube.y[0] <= cube.y[1] && cube.z[0] <= cube.z[1]) {
    return cube;
  }

  return false;
};

const reboot = (steps) => {
  const cubes = [];

  steps.forEach((step) => {
    const intersectionCubes = [];
    cubes.forEach((cube) => {
      const intersection = intersectionCube(step, cube);
      if (intersection && intersection.power !== 0) {
        intersectionCubes.push(intersection);
      }
    });

    if (step.power !== 0) {
      cubes.push(step);
    }
    cubes.push(...intersectionCubes);
  });

  return cubes.reduce((volume, { power, x, y, z }) => volume + cubeVolume(x, y, z) * power, 0);
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
