const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const solution = (lines: string[]): number => {
  return lines
    .filter((line) => line.length > 0)
    .map((rucksack, index, rucksacks) => {
      if (index % 3 !== 0) {
        return '';
      }

      const itemTypes: Record<string, boolean[] | undefined> = {};

      rucksack.split('').forEach((itemType) => {
        itemTypes[itemType] ??= [true];
      });

      rucksacks[index + 1].split('').forEach((itemType) => {
        if (itemTypes[itemType]?.length === 1) {
          itemTypes[itemType].push(true);
        }
      });

      rucksacks[index + 2].split('').forEach((itemType) => {
        if (itemTypes[itemType]?.length === 2) {
          itemTypes[itemType].push(true);
        }
      });

      const entry = Object.entries(itemTypes).find(([, value]) => !!value && value.length === 3);
      return entry ? entry[0] : '';
    })
    .filter((item) => item !== '')
    .map((item) => priorities.indexOf(item) + 1)
    .reduce((sum, priority) => sum + priority, 0);
};
