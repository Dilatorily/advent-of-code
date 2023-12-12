const NORTH = 'NORTH';
const SOUTH = 'SOUTH';
const WEST = 'WEST';
const EAST = 'EAST';

const directions = {
  '|': [NORTH, SOUTH],
  '-': [WEST, EAST],
  L: [NORTH, EAST],
  J: [NORTH, WEST],
  7: [WEST, SOUTH],
  F: [EAST, SOUTH],
};

const directionDistances = {
  [NORTH]: { column: 0, row: -1 },
  [SOUTH]: { column: 0, row: 1 },
  [WEST]: { column: -1, row: 0 },
  [EAST]: { column: 1, row: 0 },
};

const getStartNodeDirections = (map, start) => {
  const startNodeDirections = [];

  if (start.column > 0 && map[start.row][start.column - 1].directions.includes(EAST)) {
    startNodeDirections.push(WEST);
  }

  if (
    start.column < map[0].length - 1 &&
    map[start.row][start.column + 1].directions.includes(WEST)
  ) {
    startNodeDirections.push(EAST);
  }

  if (start.row > 0 && map[start.row - 1][start.column].directions.includes(SOUTH)) {
    startNodeDirections.push(NORTH);
  }

  if (start.row < map.length - 1 && map[start.row + 1][start.column].directions.includes(NORTH)) {
    startNodeDirections.push(SOUTH);
  }

  return startNodeDirections;
};

const getDirections = (cell) => {
  if (directions[cell]) {
    return directions[cell];
  }

  return [];
};

const start = { column: 0, directions: [], distance: 0, row: 0 };

const map = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((row, rowIndex) =>
    row.split('').map((cell, columnIndex) => {
      if (cell === 'S') {
        start.column = columnIndex;
        start.row = rowIndex;
      }

      return { directions: getDirections(cell) };
    }),
  );

start.directions = getStartNodeDirections(map, start);
map[start.row][start.column].directions = start.directions;

const queue = [start];

while (queue.length > 0) {
  const node = queue.shift();

  if (
    map[node.row][node.column].distance == null ||
    map[node.row][node.column].distance > node.distance
  ) {
    map[node.row][node.column].distance = node.distance;

    node.directions.forEach((direction) => {
      const nextNode =
        map[node.row + directionDistances[direction].row][
          node.column + directionDistances[direction].column
        ];
      queue.push({
        column: node.column + directionDistances[direction].column,
        directions: nextNode.directions,
        distance: node.distance + 1,
        row: node.row + directionDistances[direction].row,
      });
    });
  }
}

Math.max(
  ...map
    .flat()
    .filter(({ distance }) => distance != null)
    .map(({ distance }) => distance),
);
