export const solution = (lines: string[]) =>
  lines
    .map((string) => {
      const characters = string.split('');
      const firstDigit = characters.find((character) =>
        Number.isInteger(Number.parseInt(character, 10)),
      );
      const lastDigit = characters.findLast((character) =>
        Number.isInteger(Number.parseInt(character, 10)),
      );
      return Number.parseInt(`${firstDigit}${lastDigit}`, 10);
    })
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
