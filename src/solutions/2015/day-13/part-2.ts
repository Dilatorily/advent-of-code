import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const generatePermutations = (people: string[]) => {
  if (people.length === 1) {
    return [people];
  }

  const permutations: string[][] = [];
  people.forEach((person) => {
    const filteredPeople = people.filter((p) => person !== p);
    permutations.push(
      ...generatePermutations(filteredPeople).map((permutation) => [person, ...permutation]),
    );
  });

  return permutations;
};

export const solution = (lines: string[]) => {
  const neighbors: Record<string, Record<string, number> | undefined> = {};

  lines.forEach((line) => {
    const [from, sentence] = line.split(' would ');
    const [happinessString, person] = sentence.split(' happiness units by sitting next to ');
    const [sign, value] = happinessString.split(' ');
    const [to] = person.split('.');
    const happiness = sign === 'gain' ? toNumber(value) : -toNumber(value);

    if (!neighbors[from]) {
      neighbors[from] = { [to]: happiness };
    } else {
      neighbors[from][to] = happiness;
    }
  });

  const people = Object.keys(neighbors);
  const permutations = generatePermutations(people).map((permutation) => ['You', ...permutation]);

  const happinesses = permutations.map((permutation) =>
    permutation.reduce(
      (happiness, person, index) =>
        happiness +
        (neighbors[person]?.[permutation[(index + 1) % permutation.length]] ?? 0) +
        (neighbors[permutation[(index + 1) % permutation.length]]?.[person] ?? 0),
      0,
    ),
  );

  return Math.max(...happinesses);
};
