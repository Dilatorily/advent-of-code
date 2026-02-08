const grid = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((row) => row.split('').map((risk) => parseInt(risk, 10)));

const originalDimensions = [Math.max(...grid.map((row) => row.length)), grid.length];
const dimensions = [originalDimensions[0] * 5, originalDimensions[1] * 5];

const expandedGrid = [];
const distances = [];
const visited = [];
for (let i = 0; i < dimensions[1]; i += 1) {
  expandedGrid.push([]);
  distances.push([]);
  visited.push([]);
  for (let j = 0; j < dimensions[0]; j += 1) {
    distances[i].push(i === 0 && j === 0 ? 0 : Infinity);
    visited[i].push(false);
    const expandedValue =
      grid[i % originalDimensions[1]][j % originalDimensions[0]] +
      Math.floor(j / originalDimensions[1]) +
      Math.floor(i / originalDimensions[0]);
    expandedGrid[i].push(expandedValue > 9 ? expandedValue % 9 : expandedValue);
  }
}

const getShortestUnvisited = () => {
  let shortestDistance = Infinity;
  let coordinates;

  for (let i = 0; i < distances.length; i += 1) {
    for (let j = 0; j < distances[i].length; j += 1) {
      if (!visited[i][j] && distances[i][j] < shortestDistance) {
        shortestDistance = distances[i][j];
        coordinates = [i, j];
      }
    }
  }

  return coordinates;
};

let node = getShortestUnvisited();

while (node) {
  const [y, x] = node;
  const distance = distances[y][x];

  [
    y > 1 ? [y - 1, x] : null,
    y < dimensions[1] - 1 ? [y + 1, x] : null,
    x > 1 ? [y, x - 1] : null,
    x < dimensions[0] - 1 ? [y, x + 1] : null,
  ]
    .filter(Boolean)
    .forEach(([newY, newX]) => {
      if (distance + expandedGrid[newY][newX] < distances[newY][newX]) {
        distances[newY][newX] = distance + expandedGrid[newY][newX];
      }
    });

  visited[y][x] = true;
  node = getShortestUnvisited();
}

console.log(distances[dimensions[1] - 1][dimensions[0] - 1]);
