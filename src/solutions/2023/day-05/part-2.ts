interface MapEntry {
  destinationStart: number;
  length: number;
  sourceStart: number;
}
interface SeedRange {
  length: number;
  start: number;
}

export const solution = (lines: string[]) => {
  const data = lines
    .join('\n')
    .split('\n\n')
    .map((line) => line.split('\n'));

  const maps: MapEntry[][] = [[], [], [], [], [], [], []];
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

  const seeds: SeedRange[] = [];
  data[0][0]
    .split(': ')[1]
    .split(' ')
    .forEach((number, index, numbers) => {
      if (index % 2 === 0) {
        seeds.push({ length: parseInt(numbers[index + 1], 10), start: parseInt(number, 10) });
      }
    });

  const getMappedValue = (value: number, map: MapEntry[]) => {
    const mappedEntry = map.find(
      ({ destinationStart, length }) =>
        destinationStart <= value && value < destinationStart + length,
    );

    return !mappedEntry ? value : mappedEntry.sourceStart + (value - mappedEntry.destinationStart);
  };

  const findLocation = () => {
    for (let location = 0; location < Number.MAX_SAFE_INTEGER; location += 1) {
      const humidity = getMappedValue(location, maps[6]);
      const temperature = getMappedValue(humidity, maps[5]);
      const light = getMappedValue(temperature, maps[4]);
      const water = getMappedValue(light, maps[3]);
      const fertilizer = getMappedValue(water, maps[2]);
      const soil = getMappedValue(fertilizer, maps[1]);
      const seed = getMappedValue(soil, maps[0]);

      if (seeds.find(({ length, start }) => start <= seed && seed < start + length)) {
        return location;
      }
    }

    return undefined;
  };

  return findLocation() ?? 0;
};
