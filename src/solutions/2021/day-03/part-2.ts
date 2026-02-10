const findElement =
  (predicate: (frequencies: number[]) => boolean) =>
  (numbers: string[], substr = ''): string => {
    const filteredNumbers = numbers.filter((n) => n.startsWith(substr));
    if (filteredNumbers.length === 1) {
      return filteredNumbers[0];
    }

    const frequencies = filteredNumbers.reduce(
      (f, number) => {
        const newFrequencies = [...f];
        newFrequencies[parseInt(number[substr.length], 10)] += 1;
        return newFrequencies;
      },
      [0, 0],
    );

    if (predicate(frequencies)) {
      return findElement(predicate)(filteredNumbers, `${substr}0`);
    }

    return findElement(predicate)(filteredNumbers, `${substr}1`);
  };

const findO2 = findElement(([zeroFrequency, oneFrequency]) => zeroFrequency > oneFrequency);
const findCO2 = findElement(([zeroFrequency, oneFrequency]) => zeroFrequency <= oneFrequency);

export const solution = (lines: string[]) =>
  parseInt(findO2(lines), 2) * parseInt(findCO2(lines), 2);
