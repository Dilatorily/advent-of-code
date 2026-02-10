interface Cube {
  power: number;
  x: [number, number];
  y: [number, number];
  z: [number, number];
}

const cubeVolume = (x: [number, number], y: [number, number], z: [number, number]) =>
  (x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1);

const intersectionCube = (cube1: Cube, cube2: Cube) => {
  const cube: Cube = {
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

const reboot = (steps: Cube[]) => {
  const cubes: Cube[] = [];

  steps.forEach((step) => {
    const intersectionCubes: Cube[] = [];
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

export const solution = (lines: string[]) => {
  const steps = lines.map((step) => {
    const power = step.split(' ')[0] === 'on' ? 1 : 0;
    const x = step
      .split('x=')[1]
      .split(',')[0]
      .split('..')
      .map((number) => parseInt(number, 10)) as [number, number];
    const y = step
      .split('y=')[1]
      .split(',')[0]
      .split('..')
      .map((number) => parseInt(number, 10)) as [number, number];
    const z = step
      .split('z=')[1]
      .split(',')[0]
      .split('..')
      .map((number) => parseInt(number, 10)) as [number, number];
    return { power, x, y, z };
  });

  return reboot(steps);
};
