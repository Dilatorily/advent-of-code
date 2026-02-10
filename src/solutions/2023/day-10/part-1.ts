const NORTH = 'NORTH';
const SOUTH = 'SOUTH';
const WEST = 'WEST';
const EAST = 'EAST';

const directions: Record<string, string[]> = {
  '|': [NORTH, SOUTH],
  '-': [WEST, EAST],
  L: [NORTH, EAST],
  J: [NORTH, WEST],
  7: [WEST, SOUTH],
  F: [EAST, SOUTH],
};

const directionDistances: Record<string, { column: number; row: number }> = {
  [NORTH]: { column: 0, row: -1 },
  [SOUTH]: { column: 0, row: 1 },
  [WEST]: { column: -1, row: 0 },
  [EAST]: { column: 1, row: 0 },
};

interface Node {
  column: number;
  directions: string[];
  distance: number;
  row: number;
}
interface Cell {
  directions: string[];
  distance?: number;
}

const getStartNodeDirections = (map: Cell[][], start: Node) => {
  const startNodeDirections: string[] = [];

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

const getDirections = (cell: string) => {
  return directions[cell] ?? [];
};

export const solution = (lines: string[]) => {
  const start = { column: 0, directions: [] as string[], distance: 0, row: 0 };

  const map = lines.map<Cell[]>((row, rowIndex) =>
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
    if (!node) {
      continue;
    }

    const currentDistance = map[node.row][node.column].distance;
    if (currentDistance == null || currentDistance > node.distance) {
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

  return Math.max(
    ...map
      .flat()
      .map(({ distance }) => distance)
      .filter((distance) => distance != null),
  );
};
