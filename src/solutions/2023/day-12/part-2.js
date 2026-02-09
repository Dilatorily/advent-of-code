import { fillArray } from '#dilatorily/advent-of-code/utility/fill-array';
import { memoize } from '#dilatorily/advent-of-code/utility/memoize';
import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const calculateArrangements = memoize((row, groups) => {
  // Has a possible arrangement if the row and the groups are both empty
  if (row.length === 0) {
    return groups.length === 0 ? 1 : 0;
  }

  // Has a possible arrangement if the groups is empty and the row only contains . and ?
  if (groups.length === 0) {
    return row.includes('#') ? 0 : 1;
  }

  // The row is too short for all of the groups
  if (row.length < groups.reduce(sum) + (groups.length - 1)) {
    return 0;
  }

  const character = row[0];

  // If the first character is ., calculate the arrangements for the substring
  if (character === '.') {
    return calculateArrangements(row.slice(1), groups);
  }

  // If the first character is #, check if the contiguous group is valid
  if (character === '#') {
    const [group, ...otherGroups] = groups;

    // The group is not contiguous
    if (row.slice(0, group).includes('.')) {
      return 0;
    }

    // The contiguous group is too long
    if (row[group] === '#') {
      return 0;
    }

    // Calculate the arrangements after the contiguous group
    return calculateArrangements(row.slice(group + 1), otherGroups);
  }

  // If the first character is ?, calculate the arrangements by replacing it with the other characters (# and .)
  return (
    calculateArrangements(`#${row.slice(1)}`, groups) +
    calculateArrangements(`.${row.slice(1)}`, groups)
  );
});

export default (input) => {
  const records = input.split('\n');
  const arrangements = records
    .map((record) => {
      const [row, groupsString] = record.split(' ');
      const groups = groupsString.split(',').map(toNumber);
      return calculateArrangements(fillArray(5, row).join('?'), fillArray(5, groups).flat());
    })
    .reduce(sum);

  return arrangements;
};
