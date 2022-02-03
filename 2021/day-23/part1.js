// #############
// #...........#
// ###B#C#B#D###
//   #A#D#C#A#
//   #########
const costs = { A: 1, B: 10, C: 100, D: 1000 };
const roomMap = { A: 0, B: 1, C: 2, D: 3 };

const paths = [
  { cost: 3, direction: 'in', hallway: 0, path: [1], room: 0 },
  { cost: 5, direction: 'in', hallway: 0, path: [1, 3], room: 1 },
  { cost: 7, direction: 'in', hallway: 0, path: [1, 3, 5], room: 2 },
  { cost: 9, direction: 'in', hallway: 0, path: [1, 3, 5, 7], room: 3 },
  { cost: 2, direction: 'in', hallway: 1, path: [], room: 0 },
  { cost: 4, direction: 'in', hallway: 1, path: [3], room: 1 },
  { cost: 6, direction: 'in', hallway: 1, path: [3, 5], room: 2 },
  { cost: 8, direction: 'in', hallway: 1, path: [3, 5, 7], room: 3 },
  { cost: 2, direction: 'in', hallway: 3, path: [], room: 0 },
  { cost: 2, direction: 'in', hallway: 3, path: [], room: 1 },
  { cost: 4, direction: 'in', hallway: 3, path: [5], room: 2 },
  { cost: 6, direction: 'in', hallway: 3, path: [5, 7], room: 3 },
  { cost: 4, direction: 'in', hallway: 5, path: [3], room: 0 },
  { cost: 2, direction: 'in', hallway: 5, path: [], room: 1 },
  { cost: 2, direction: 'in', hallway: 5, path: [], room: 2 },
  { cost: 4, direction: 'in', hallway: 5, path: [7], room: 3 },
  { cost: 6, direction: 'in', hallway: 7, path: [3, 5], room: 0 },
  { cost: 4, direction: 'in', hallway: 7, path: [5], room: 1 },
  { cost: 2, direction: 'in', hallway: 7, path: [], room: 2 },
  { cost: 2, direction: 'in', hallway: 7, path: [], room: 3 },
  { cost: 8, direction: 'in', hallway: 9, path: [3, 5, 7], room: 0 },
  { cost: 6, direction: 'in', hallway: 9, path: [5, 7], room: 1 },
  { cost: 4, direction: 'in', hallway: 9, path: [7], room: 2 },
  { cost: 2, direction: 'in', hallway: 9, path: [], room: 3 },
  { cost: 9, direction: 'in', hallway: 10, path: [3, 5, 7, 9], room: 0 },
  { cost: 7, direction: 'in', hallway: 10, path: [5, 7, 9], room: 1 },
  { cost: 5, direction: 'in', hallway: 10, path: [7, 9], room: 2 },
  { cost: 3, direction: 'in', hallway: 10, path: [9], room: 3 },
  { cost: 3, direction: 'out', hallway: 0, path: [1], room: 0 },
  { cost: 5, direction: 'out', hallway: 0, path: [1, 3], room: 1 },
  { cost: 7, direction: 'out', hallway: 0, path: [1, 3, 5], room: 2 },
  { cost: 9, direction: 'out', hallway: 0, path: [1, 3, 5, 7], room: 3 },
  { cost: 2, direction: 'out', hallway: 1, path: [], room: 0 },
  { cost: 4, direction: 'out', hallway: 1, path: [3], room: 1 },
  { cost: 6, direction: 'out', hallway: 1, path: [3, 5], room: 2 },
  { cost: 8, direction: 'out', hallway: 1, path: [3, 5, 7], room: 3 },
  { cost: 2, direction: 'out', hallway: 3, path: [], room: 0 },
  { cost: 2, direction: 'out', hallway: 3, path: [], room: 1 },
  { cost: 4, direction: 'out', hallway: 3, path: [5], room: 2 },
  { cost: 6, direction: 'out', hallway: 3, path: [5, 7], room: 3 },
  { cost: 4, direction: 'out', hallway: 5, path: [3], room: 0 },
  { cost: 2, direction: 'out', hallway: 5, path: [], room: 1 },
  { cost: 2, direction: 'out', hallway: 5, path: [], room: 2 },
  { cost: 4, direction: 'out', hallway: 5, path: [7], room: 3 },
  { cost: 6, direction: 'out', hallway: 7, path: [3, 5], room: 0 },
  { cost: 4, direction: 'out', hallway: 7, path: [5], room: 1 },
  { cost: 2, direction: 'out', hallway: 7, path: [], room: 2 },
  { cost: 2, direction: 'out', hallway: 7, path: [], room: 3 },
  { cost: 8, direction: 'out', hallway: 9, path: [3, 5, 7], room: 0 },
  { cost: 6, direction: 'out', hallway: 9, path: [5, 7], room: 1 },
  { cost: 4, direction: 'out', hallway: 9, path: [7], room: 2 },
  { cost: 2, direction: 'out', hallway: 9, path: [], room: 3 },
  { cost: 9, direction: 'out', hallway: 10, path: [3, 5, 7, 9], room: 0 },
  { cost: 7, direction: 'out', hallway: 10, path: [5, 7, 9], room: 1 },
  { cost: 5, direction: 'out', hallway: 10, path: [7, 9], room: 2 },
  { cost: 3, direction: 'out', hallway: 10, path: [9], room: 3 },
];

const transpose = (matrix) => matrix[0].map((...[, index]) => matrix.map((row) => row[index]));

const keyToState = (key) => ({
  hallway: key.slice(0, 11).split(''),
  rooms: key
    .slice(11)
    .split('')
    .reduce(
      (rooms, room, index) => {
        rooms[index % 4].push(room);
        return rooms;
      },
      [[], [], [], []],
    ),
});

const stateToKey = ({ hallway, rooms }) =>
  [...hallway, ...transpose(rooms).map((row) => row.join(''))].join('');

const isRoomEmpty = (room) => room[room.length - 1] === '.';

const isValidPath = (state, { direction, hallway, room, path }) => {
  if (
    direction === 'in' &&
    (state.hallway[hallway] === '.' ||
      !isRoomEmpty(state.rooms[room]) ||
      roomMap[state.hallway[hallway]] !== room)
  ) {
    return false;
  }

  if (
    direction === 'out' &&
    (state.hallway[hallway] !== '.' ||
      isRoomEmpty(state.rooms[room]) ||
      roomMap[state.rooms[room].find((cell) => cell !== '.')] === room)
  ) {
    return false;
  }

  return path.reduce((isFree, cell) => isFree && state.hallway[cell] === '.', true);
};

const cache = {};
const minimizeSteps = (stateKey, endStateKey, cost = 0) => {
  if (cache[stateKey]) {
    if (cost < cache[stateKey]) {
      cache[stateKey] = cost;
    }

    return cache[stateKey];
  }

  if (stateKey === endStateKey) {
    console.log(cost);
    return cost;
  }

  console.log(stateKey);
  const state = keyToState(stateKey);

  let minimum = Infinity;
  paths.forEach((path) => {
    const room = state.rooms[path.room];
    const isValid = isValidPath(state, path);
    if (isValid) {
      const pod =
        path.direction === 'in' ? state.hallway[path.hallway] : room.find((cell) => cell !== '.');
      const roomPosition =
        path.direction === 'in' ? room.lastIndexOf('.') : room.findIndex((cell) => cell !== '.');

      const newState = JSON.parse(JSON.stringify(state));
      newState.rooms[path.room][roomPosition] = state.hallway[path.hallway];
      newState.hallway[path.hallway] = state.rooms[path.room][roomPosition];

      const newStateKey = stateToKey(newState);
      const roomCost = roomPosition + 1;
      const newCost = (path.cost + roomCost) * costs[pod];
      console.log(newCost);

      const temporaryMinimum = minimizeSteps(newStateKey, endStateKey, cost + newCost);
      if (temporaryMinimum < minimum) {
        minimum = temporaryMinimum;
      }
    }
  });

  cache[stateKey] = minimum;
  return cache[stateKey];
};

const process = (hallway, rooms, endRooms, roomSize) => {
  const state = `${hallway}${rooms}`;
  const endState = `${hallway}${endRooms.repeat(roomSize)}`;
  return minimizeSteps(state, endState);
};

const hallway = document.querySelector('pre').textContent.split('\n')[1].replaceAll('#', '');
const rooms = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(2, 4)
  .map((row) => row.replaceAll('##', '').replaceAll('  ', '').split('#').slice(1, -1).join(''))
  .join('');
process(hallway, rooms, 'ABCD', 2);
