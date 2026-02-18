const NORTH = 'NORTH';
const SOUTH = 'SOUTH';
const WEST = 'WEST';
const EAST = 'EAST';

const directionDistances: Record<string, { column: number; row: number }> = {
  [EAST]: { column: 1, row: 0 },
  [NORTH]: { column: 0, row: -1 },
  [SOUTH]: { column: 0, row: 1 },
  [WEST]: { column: -1, row: 0 },
};

const directions: Record<string, string[]> = {
  7: [WEST, SOUTH],
  '-': [WEST, EAST],
  F: [EAST, SOUTH],
  J: [NORTH, WEST],
  L: [NORTH, EAST],
  '|': [NORTH, SOUTH],
};

const boundaries = ['|', '-', 'J', 'F'];

interface Cell {
  content: string;
  directions: string[];
  isLoop: boolean;
}

interface Node {
  column: number;
  directions: string[];
  row: number;
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

const getStartEquivalent = (start: Node) =>
  Object.entries(directions)
    .filter(([, direction]) =>
      direction.every((cardinality) => start.directions.includes(cardinality)),
    )
    .map(([symbol]) => symbol)[0];

const getDirections = (cell: string) => {
  return directions[cell] ?? [];
};

export const solution = (lines: string[]) => {
  const start = { column: 0, directions: [] as string[], row: 0 };
  const map = lines.map<Cell[]>((row, rowIndex) =>
    row.split('').map((cell, columnIndex) => {
      if (cell === 'S') {
        start.column = columnIndex;
        start.row = rowIndex;
      }

      return { content: cell, directions: getDirections(cell), isLoop: cell === 'S' };
    }),
  );

  start.directions = getStartNodeDirections(map, start);

  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;

    node.directions.forEach((direction) => {
      const nextNode =
        map[node.row + directionDistances[direction].row][
          node.column + directionDistances[direction].column
        ];
      if (!nextNode.isLoop) {
        nextNode.isLoop = true;
        queue.push({
          column: node.column + directionDistances[direction].column,
          directions: nextNode.directions,
          row: node.row + directionDistances[direction].row,
        });
      }
    });
  }

  map[start.row][start.column].content = getStartEquivalent(start) || 'S';

  let isEnclosed = 0;
  map.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell.isLoop) {
        return;
      }

      let boundaryCount = 0;
      let x = columnIndex + 1;
      let y = rowIndex + 1;
      while (x < row.length && y < map.length) {
        if (map[y][x].isLoop && boundaries.includes(map[y][x].content)) {
          boundaryCount += 1;
        }

        x += 1;
        y += 1;
      }

      if (boundaryCount % 2 === 1) {
        isEnclosed += 1;
      }
    });
  });

  return isEnclosed;
};
