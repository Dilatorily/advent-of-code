const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((rucksack, index, rucksacks) => {
    if (index % 3 !== 0) {
      return '';
    }

    const itemTypes = {};

    rucksack.split('').forEach((itemType) => {
      if (!itemTypes[itemType]) {
        itemTypes[itemType] = [true];
      }
    });

    rucksacks[index + 1].split('').forEach((itemType) => {
      if (itemTypes[itemType] && itemTypes[itemType].length === 1) {
        itemTypes[itemType].push(true);
      }
    });

    rucksacks[index + 2].split('').forEach((itemType) => {
      if (itemTypes[itemType] && itemTypes[itemType].length === 2) {
        itemTypes[itemType].push(true);
      }
    });

    return Object.entries(itemTypes).find(([, value]) => value.length === 3)[0];
  })
  .filter((item) => item !== '')
  .map((item) => priorities.indexOf(item) + 1)
  .reduce((sum, priority) => sum + priority, 0);
