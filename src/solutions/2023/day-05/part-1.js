const data = document
  .querySelector('pre')
  .textContent.slice(0, -1)
  .split('\n\n')
  .map((line) => line.split('\n'));

const maps = [[], [], [], [], [], [], []];
data.forEach((map, mapIndex) => {
  if (mapIndex === 0) {
    return;
  }

  map.forEach((entry, entryIndex) => {
    if (entryIndex === 0) {
      return;
    }

    const [destinationStart, sourceStart, length] = entry
      .split(' ')
      .map((number) => Number.parseInt(number, 10));

    maps[mapIndex - 1].push({ destinationStart, length, sourceStart });
  });
});

const getMappedValue = (value, map) => {
  const mappedEntry = map.find(
    ({ length, sourceStart }) => sourceStart <= value && value < sourceStart + length,
  );

  return !mappedEntry ? value : mappedEntry.destinationStart + (value - mappedEntry.sourceStart);
};

Math.min(
  ...data[0][0]
    .split(': ')[1]
    .split(' ')
    .map((number) => {
      const seed = Number.parseInt(number, 10);
      const soil = getMappedValue(seed, maps[0]);
      const fertilizer = getMappedValue(soil, maps[1]);
      const water = getMappedValue(fertilizer, maps[2]);
      const light = getMappedValue(water, maps[3]);
      const temperature = getMappedValue(light, maps[4]);
      const humidity = getMappedValue(temperature, maps[5]);
      return getMappedValue(humidity, maps[6]);
    }),
);
