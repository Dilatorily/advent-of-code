document
  .querySelector('pre')
  .textContent.split('\n')[0]
  .split('')
  .findIndex((character, index, buffer) => {
    if (index < 4) {
      return false;
    }

    const set = new Set();
    set.add(character);
    set.add(buffer[index - 1]);
    set.add(buffer[index - 2]);
    set.add(buffer[index - 3]);

    return set.size === 4;
  }) + 1;
