const numbers = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((string) => {
    let newString = '';

    for (let i = 0; i < string.length; i += 1) {
      const character = string[i];
      if (Number.isInteger(Number.parseInt(character, 10))) {
        newString = `${newString}${character}`;
      } else if (['one', 'two', 'six'].includes(string.substring(i, i + 3))) {
        newString = `${newString}${numbers[string.substring(i, i + 3)]}`;
      } else if (['four', 'five', 'nine'].includes(string.substring(i, i + 4))) {
        newString = `${newString}${numbers[string.substring(i, i + 4)]}`;
      } else if (['three', 'seven', 'eight'].includes(string.substring(i, i + 5))) {
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
