const octopi = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((row) => row.split('').map((number) => parseInt(number, 10)));

const countFlashes = (grid, steps, flashes = 0) => {
  if (steps === 0) {
    return flashes;
  }

  const newGrid = [];
  const queue = [];

  grid.forEach((row, rowIndex) => {
    newGrid.push([]);
    row.forEach((octopus, columnIndex) => {
      if (octopus + 1 > 9) {
        newGrid[rowIndex].push(0);
        queue.push({ column: columnIndex, row: rowIndex });
      } else {
        newGrid[rowIndex].push(octopus + 1);
      }
    });
  });

  while (queue.length > 0) {
    const { column, row } = queue.pop();

    // Handle grid edges
    for (let i = row - 1; i <= row + 1; i += 1) {
      if (i >= 0 && i <= newGrid.length - 1) {
        for (let j = column - 1; j <= column + 1; j += 1) {
          if (j >= 0 && j <= newGrid[i].length - 1) {
            // Handle recursive flashes
            if (newGrid[i][j] + 1 > 9) {
              newGrid[i][j] = 0;
              queue.push({ column: j, row: i });

              // Avoids incrementing flashed octopi
            } else if (newGrid[i][j] > 0) {
              newGrid[i][j] += 1;
            }
          }
        }
      }
    }
  }

  return countFlashes(
    newGrid,
    steps - 1,
    flashes + newGrid.reduce((sum, row) => sum + row.filter((cell) => cell === 0).length, 0),
  );
};

countFlashes(octopi, 100);
