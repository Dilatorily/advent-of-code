document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .reduce((frequencies, number) => {
    const newFrequencies = [...frequencies];
    const bits = number.split('');
    bits.forEach((bit, index) => {
      if (!newFrequencies[index]) {
        newFrequencies[index] = [0, 0];
      }
      newFrequencies[index][parseInt(bit, 10)] += 1;
    });

    return newFrequencies;
  }, [])
  .reduce(
    ([gamma, epsilon], frequency) => {
      if (frequency[0] > frequency[1]) {
        return [`${gamma}0`, `${epsilon}1`];
      }

      return [`${gamma}1`, `${epsilon}0`];
    },
    ['', ''],
  )
  .map((str) => parseInt(str, 2))
  .reduce((a, b) => a * b, 1);
