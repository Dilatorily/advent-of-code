import { areArraysEqual } from '#dilatorily/advent-of-code/utility/are-arrays-equal';
import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const generatePermutations = (locations: string[]) => {
  if (locations.length === 1) {
    return [locations];
  }

  const permutations: string[][] = [];
  locations.forEach((location) => {
    const filteredLocations = locations.filter((l) => location !== l);
    permutations.push(
      ...generatePermutations(filteredLocations).map((permutation) => [location, ...permutation]),
    );
  });

  return permutations;
};

const filterPermutations = (permutations: string[][]) => {
  const filteredPermutations: string[][] = [];

  permutations.forEach((permutation) => {
    const reversedPermutation = [...permutation].reverse();

    const isPermutationPresent = !!filteredPermutations.find(
      (filteredPermutation) =>
        areArraysEqual(filteredPermutation, permutation) ||
        areArraysEqual(filteredPermutation, reversedPermutation),
    );
    if (!isPermutationPresent) {
      filteredPermutations.push(permutation);
    }
  });

  return filteredPermutations;
};

export const solution = (lines: string[]) => {
  const neighbors: Record<string, Record<string, number> | undefined> = {};

  lines.forEach((line) => {
    const [itinerary, distance] = line.split(' = ');
    const [from, to] = itinerary.split(' to ');

    if (!neighbors[from]) {
      neighbors[from] = { [to]: toNumber(distance) };
    } else {
      neighbors[from][to] = toNumber(distance);
    }

    if (!neighbors[to]) {
      neighbors[to] = { [from]: toNumber(distance) };
    } else {
      neighbors[to][from] = toNumber(distance);
    }
  });

  const locations = Object.keys(neighbors);
  const permutations = filterPermutations(generatePermutations(locations));

  const distances = permutations.map((permutation) =>
    permutation.reduce((distance, location, index) => {
      if (index === 0 || !neighbors[location]) {
        return distance;
      }

      return distance + neighbors[location][permutation[index - 1]];
    }, 0),
  );

  return Math.max(...distances);
};
