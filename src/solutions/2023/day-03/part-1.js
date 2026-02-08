const NON_SYMBOL_CHARACTERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((row, rowIndex, rows) => {
    const characters = row.split('');
    let sum = 0;

    for (let columnIndex = 0; columnIndex < characters.length; columnIndex += 1) {
      if (Number.isInteger(Number.parseInt(characters[columnIndex], 10))) {
        let shouldAddNumber = false;
        let number = `${characters[columnIndex]}`;
        const columnIndexStart = columnIndex - 1;

        while (Number.isInteger(Number.parseInt(characters[columnIndex + 1], 10))) {
          columnIndex += 1;
          number = `${number}${characters[columnIndex]}`;
        }

        const columnIndexEnd = columnIndex + 1;

        // Check top-left cell
        if (
          rowIndex - 1 >= 0 &&
          columnIndexStart >= 0 &&
          !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex - 1][columnIndexStart])
        ) {
          shouldAddNumber = true;
        }

        // Check top cells
        for (let i = 1; i <= number.length; i += 1) {
          if (
            rowIndex - 1 >= 0 &&
            !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex - 1][columnIndexStart + i])
          ) {
            shouldAddNumber = true;
            break;
          }
        }

        // Check top-right cell
        if (
          rowIndex - 1 >= 0 &&
          columnIndexEnd < characters.length &&
          !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex - 1][columnIndexEnd])
        ) {
          shouldAddNumber = true;
        }

        // Check left cell
        if (
          columnIndexStart >= 0 &&
          !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex][columnIndexStart])
        ) {
          shouldAddNumber = true;
        }

        // Check right cell
        if (
          columnIndexEnd < characters.length &&
          !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex][columnIndexEnd])
        ) {
          shouldAddNumber = true;
        }

        // Check bottom-left cell
        if (
          rowIndex + 1 < rows.length &&
          columnIndexStart >= 0 &&
          !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex + 1][columnIndexStart])
        ) {
          shouldAddNumber = true;
        }

        // Check bottom cells
        for (let i = 1; i <= number.length; i += 1) {
          if (
            rowIndex + 1 < rows.length &&
            !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex + 1][columnIndexStart + i])
          ) {
            shouldAddNumber = true;
            break;
          }
        }

        // Check bottom-right cell
        if (
          rowIndex + 1 < rows.length &&
          columnIndexEnd < characters.length &&
          !NON_SYMBOL_CHARACTERS.includes(rows[rowIndex + 1][columnIndexEnd])
        ) {
          shouldAddNumber = true;
        }

        if (shouldAddNumber) {
          sum += Number.parseInt(number, 10);
        }
      }
    }

    return sum;
  })
  .reduce((sum, number) => sum + number, 0);
