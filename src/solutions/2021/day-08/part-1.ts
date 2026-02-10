export const solution = (lines: string[]) =>
  lines
    .map((string) => {
      const [patterns, output] = string.split(' | ');
      return { output: output.split(' '), patterns: patterns.split(' ') };
    })
    .reduce((sum, { output, patterns }) => {
      const digits: Record<number, string> = {};
      let count = 0;

      patterns.forEach((pattern) => {
        if (pattern.length === 2) {
          digits[1] = pattern.split('').sort().join('');
        }

        if (pattern.length === 4) {
          digits[4] = pattern.split('').sort().join('');
        }

        if (pattern.length === 3) {
          digits[7] = pattern.split('').sort().join('');
        }

        if (pattern.length === 7) {
          digits[8] = pattern.split('').sort().join('');
        }
      });

      output.forEach((digit) => {
        if (Object.values(digits).includes(digit.split('').sort().join(''))) {
          count += 1;
        }
      });

      return sum + count;
    }, 0);
