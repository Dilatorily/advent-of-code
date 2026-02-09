const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const solution = (lines: string[]): number => {
  return lines
    .filter((line) => line.length > 0)
    .map((rucksack) => {
      const firstCompartment = rucksack.slice(0, rucksack.length / 2);
      const secondCompartment = rucksack.slice(rucksack.length / 2);

      const itemTypeInFirstCompartment: Record<string, boolean> = {};
      firstCompartment.split('').forEach((itemType) => {
        if (!itemTypeInFirstCompartment[itemType]) {
          itemTypeInFirstCompartment[itemType] = true;
        }
      });

      const commonItem = secondCompartment
        .split('')
        .find((itemType) => itemTypeInFirstCompartment[itemType]);

      return priorities.indexOf(commonItem || '') + 1;
    })
    .reduce((sum, priority) => sum + priority, 0);
};
