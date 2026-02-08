document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((row, rowIndex, rows) => {
    const characters = row.split('');
    let sum = 0;

    for (let columnIndex = 0; columnIndex < characters.length; columnIndex += 1) {
      if (characters[columnIndex] === '*') {
        const adjacentPartNumbers = [];

        // Check left
        if (
          columnIndex - 1 >= 0 &&
          Number.isInteger(Number.parseInt(characters[columnIndex - 1], 10))
        ) {
          const numberEnd = columnIndex - 1;
          let number = characters[numberEnd];

          let numberIndex = numberEnd - 1;
          while (
            numberIndex >= 0 &&
            Number.isInteger(Number.parseInt(characters[numberIndex], 10))
          ) {
            number = `${characters[numberIndex]}${number}`;
            numberIndex -= 1;
          }

          adjacentPartNumbers.push(Number.parseInt(number, 10));
        }

        // Check right
        if (
          columnIndex + 1 < characters.length &&
          Number.isInteger(Number.parseInt(characters[columnIndex + 1], 10))
        ) {
          const numberStart = columnIndex + 1;
          let number = characters[numberStart];

          let numberIndex = numberStart + 1;
          while (
            numberIndex < characters.length &&
            Number.isInteger(Number.parseInt(characters[numberIndex], 10))
          ) {
            number = `${number}${characters[numberIndex]}`;
            numberIndex += 1;
          }

          adjacentPartNumbers.push(Number.parseInt(number, 10));
        }

        // Check top
        if (rowIndex - 1 >= 0) {
          if (Number.isInteger(Number.parseInt(rows[rowIndex - 1][columnIndex], 10))) {
            let number = rows[rowIndex - 1][columnIndex];

            let numberIndex = columnIndex - 1;
            while (
              numberIndex >= 0 &&
              Number.isInteger(Number.parseInt(rows[rowIndex - 1][numberIndex], 10))
            ) {
              number = `${rows[rowIndex - 1][numberIndex]}${number}`;
              numberIndex -= 1;
            }

            numberIndex = columnIndex + 1;
            while (
              numberIndex < characters.length &&
              Number.isInteger(Number.parseInt(rows[rowIndex - 1][numberIndex], 10))
            ) {
              number = `${number}${rows[rowIndex - 1][numberIndex]}`;
              numberIndex += 1;
            }

            adjacentPartNumbers.push(Number.parseInt(number, 10));
          } else {
            // Check top-left
            if (
              columnIndex - 1 >= 0 &&
              Number.isInteger(Number.parseInt(rows[rowIndex - 1][columnIndex - 1], 10))
            ) {
              let number = rows[rowIndex - 1][columnIndex - 1];

              let numberIndex = columnIndex - 2;
              while (
                numberIndex >= 0 &&
                Number.isInteger(Number.parseInt(rows[rowIndex - 1][numberIndex], 10))
              ) {
                number = `${rows[rowIndex - 1][numberIndex]}${number}`;
                numberIndex -= 1;
              }

              adjacentPartNumbers.push(Number.parseInt(number, 10));
            }

            // Check top-right
            if (
              columnIndex + 1 < characters.length &&
              Number.isInteger(Number.parseInt(rows[rowIndex - 1][columnIndex + 1], 10))
            ) {
              let number = rows[rowIndex - 1][columnIndex + 1];

              let numberIndex = columnIndex + 2;
              while (
                numberIndex < characters.length &&
                Number.isInteger(Number.parseInt(rows[rowIndex - 1][numberIndex], 10))
              ) {
                number = `${number}${rows[rowIndex - 1][numberIndex]}`;
                numberIndex += 1;
              }

              adjacentPartNumbers.push(Number.parseInt(number, 10));
            }
          }
        }

        // Check bottom
        if (rowIndex + 1 < rows.length) {
          if (Number.isInteger(Number.parseInt(rows[rowIndex + 1][columnIndex], 10))) {
            let number = rows[rowIndex + 1][columnIndex];

            let numberIndex = columnIndex - 1;
            while (
              numberIndex >= 0 &&
              Number.isInteger(Number.parseInt(rows[rowIndex + 1][numberIndex], 10))
            ) {
              number = `${rows[rowIndex + 1][numberIndex]}${number}`;
              numberIndex -= 1;
            }

            numberIndex = columnIndex + 1;
            while (
              numberIndex < characters.length &&
              Number.isInteger(Number.parseInt(rows[rowIndex + 1][numberIndex], 10))
            ) {
              number = `${number}${rows[rowIndex + 1][numberIndex]}`;
              numberIndex += 1;
            }

            adjacentPartNumbers.push(Number.parseInt(number, 10));
          } else {
            // Check bottom-left
            if (
              columnIndex - 1 >= 0 &&
              Number.isInteger(Number.parseInt(rows[rowIndex + 1][columnIndex - 1], 10))
            ) {
              let number = rows[rowIndex + 1][columnIndex - 1];

              let numberIndex = columnIndex - 2;
              while (
                numberIndex >= 0 &&
                Number.isInteger(Number.parseInt(rows[rowIndex + 1][numberIndex], 10))
              ) {
                number = `${rows[rowIndex + 1][numberIndex]}${number}`;
                numberIndex -= 1;
              }

              adjacentPartNumbers.push(Number.parseInt(number, 10));
            }

            // Check bottom-right
            if (
              columnIndex + 1 < characters.length &&
              Number.isInteger(Number.parseInt(rows[rowIndex + 1][columnIndex + 1], 10))
            ) {
              let number = rows[rowIndex + 1][columnIndex + 1];

              let numberIndex = columnIndex + 2;
              while (
                numberIndex < characters.length &&
                Number.isInteger(Number.parseInt(rows[rowIndex + 1][numberIndex], 10))
              ) {
                number = `${number}${rows[rowIndex + 1][numberIndex]}`;
                numberIndex += 1;
              }

              adjacentPartNumbers.push(Number.parseInt(number, 10));
            }
          }
        }

        if (adjacentPartNumbers.length === 2) {
          sum += adjacentPartNumbers[0] * adjacentPartNumbers[1];
        }
      }
    }

    return sum;
  })
  .reduce((sum, number) => sum + number, 0);
