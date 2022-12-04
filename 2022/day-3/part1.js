const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((rucksack) => {
    const firstCompartment = rucksack.slice(0, rucksack.length / 2);
    const secondCompartment = rucksack.slice(rucksack.length / 2);

    const itemTypeInFirstCompartment = {};
    firstCompartment.split('').forEach((itemType) => {
      if (!itemTypeInFirstCompartment[itemType]) {
        itemTypeInFirstCompartment[itemType] = true;
      }
    });

    const commonItem = secondCompartment
      .split('')
      .find((itemType) => itemTypeInFirstCompartment[itemType]);

    return priorities.indexOf(commonItem) + 1;
  })
  .reduce((sum, priority) => sum + priority, 0);
