export const solution = (lines: string[]) =>
  Object.entries(
    lines
      .map((vents) => {
        const vector = vents.split(' -> ');
        return vector.map((coordinates) =>
          coordinates.split(',').map((coordinate) => parseInt(coordinate, 10)),
        );
      })
      .reduce<Record<string, number>>((grid, vector) => {
        const isVertical = vector[0][0] === vector[1][0];
        const isHorizontal = vector[0][1] === vector[1][1];

        if (isVertical || isHorizontal) {
          const index = isVertical ? 1 : 0;
          const start = Math.min(vector[0][index], vector[1][index]);
          const end = Math.max(vector[0][index], vector[1][index]);

          for (let i = start; i <= end; i += 1) {
            const coordinates = `${isVertical ? vector[0][0] : i},${isVertical ? i : vector[0][1]}`;
            Object.assign(grid, { [coordinates]: (grid[coordinates] || 0) + 1 });
          }
        } else {
          const length = Math.abs(vector[1][0] - vector[0][0]) + 1;
          for (let i = 0; i < length; i += 1) {
            const coordinates = `${
              vector[1][0] > vector[0][0] ? vector[0][0] + i : vector[0][0] - i
            },${vector[1][1] > vector[0][1] ? vector[0][1] + i : vector[0][1] - i}`;
            Object.assign(grid, { [coordinates]: (grid[coordinates] || 0) + 1 });
          }
        }

        return grid;
      }, {}),
  ).filter(([, overlap]) => overlap >= 2).length;
