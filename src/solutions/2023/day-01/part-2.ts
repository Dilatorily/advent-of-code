const numbers: Record<string, number> = {
  eight: 8,
  five: 5,
  four: 4,
  nine: 9,
  one: 1,
  seven: 7,
  six: 6,
  three: 3,
  two: 2,
};

export const solution = (lines: string[]) =>
  lines
    .map((string) => {
      let newString = '';

      for (let i = 0; i < string.length; i += 1) {
        const character = string[i];
        if (Number.isInteger(Number.parseInt(character, 10))) {
          newString = `${newString}${character}`;
        } else if (['one', 'six', 'two'].includes(string.substring(i, i + 3))) {
          newString = `${newString}${numbers[string.substring(i, i + 3)]}`;
        } else if (['five', 'four', 'nine'].includes(string.substring(i, i + 4))) {
          newString = `${newString}${numbers[string.substring(i, i + 4)]}`;
        } else if (['eight', 'seven', 'three'].includes(string.substring(i, i + 5))) {
          newString = `${newString}${numbers[string.substring(i, i + 5)]}`;
        }
      }

      return newString;
    })
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
