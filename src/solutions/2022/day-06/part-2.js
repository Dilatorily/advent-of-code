const maximum = 14;

document
  .querySelector('pre')
  .textContent.split('\n')[0]
  .split('')
  .findIndex((_, index, buffer) => {
    if (index < maximum) {
      return false;
    }

    const set = new Set();

    for (let i = 0; i < maximum; i += 1) {
      set.add(buffer[index - i]);
    }

    return set.size === maximum;
  }) + 1;
