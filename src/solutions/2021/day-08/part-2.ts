export const solution = (lines: string[]) =>
  lines
    .map((string) => {
      const [patterns, output] = string.split(' | ');
      return {
        output: output.split(' ').map((digit) => digit.split('').sort().join('')),
        patterns: patterns.split(' ').map((digit) => digit.split('').sort().join('')),
      };
    })
    .reduce((sum, { output, patterns }) => {
      const digits: Record<number, string> = {};
      const frequencies: Record<string, number> = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
      };
      const segments = {
        bottom: '',
        bottomLeft: '',
        bottomRight: '',
        middle: '',
        top: '',
        topLeft: '',
        topRight: '',
      };

      digits[1] = patterns.find((pattern) => pattern.length === 2) ?? '';
      digits[4] = patterns.find((pattern) => pattern.length === 4) ?? '';
      digits[7] = patterns.find((pattern) => pattern.length === 3) ?? '';
      digits[8] = patterns.find((pattern) => pattern.length === 7) ?? '';

      patterns.forEach((pattern) => {
        pattern.split('').forEach((segment) => {
          frequencies[segment] += 1;
        });
      });

      [segments.top] = digits[7]
        .split('')
        .filter((segment) => !digits[1].split('').includes(segment));
      [segments.topLeft] = Object.entries(frequencies).find(
        ([, frequency]) => frequency === 6,
      )?.[0] ?? [''];
      [segments.bottomLeft] = Object.entries(frequencies).find(
        ([, frequency]) => frequency === 4,
      )?.[0] ?? [''];
      [segments.bottomRight] = Object.entries(frequencies).find(
        ([, frequency]) => frequency === 9,
      )?.[0] ?? [''];
      [segments.topRight] = Object.entries(frequencies).find(
        ([segment, frequency]) => frequency === 8 && segment !== segments.top,
      )?.[0] ?? [''];
      [segments.middle] = digits[4]
        .split('')
        .filter(
          (segment) =>
            ![segments.bottomRight, segments.topLeft, segments.topRight].includes(segment),
        );
      [segments.bottom] = digits[8]
        .split('')
        .filter((segment) => !Object.values(segments).includes(segment));

      digits[0] = [
        segments.top,
        segments.topLeft,
        segments.topRight,
        segments.bottomLeft,
        segments.bottomRight,
        segments.bottom,
      ]
        .sort()
        .join('');
      digits[2] = [
        segments.top,
        segments.topRight,
        segments.middle,
        segments.bottomLeft,
        segments.bottom,
      ]
        .sort()
        .join('');
      digits[3] = [
        segments.top,
        segments.topRight,
        segments.middle,
        segments.bottomRight,
        segments.bottom,
      ]
        .sort()
        .join('');
      digits[5] = [
        segments.top,
        segments.topLeft,
        segments.middle,
        segments.bottomRight,
        segments.bottom,
      ]
        .sort()
        .join('');
      digits[6] = [
        segments.top,
        segments.topLeft,
        segments.middle,
        segments.bottomLeft,
        segments.bottomRight,
        segments.bottom,
      ]
        .sort()
        .join('');
      digits[9] = [
        segments.top,
        segments.topLeft,
        segments.topRight,
        segments.middle,
        segments.bottomRight,
        segments.bottom,
      ]
        .sort()
        .join('');
      const segmentsToDigit = Object.entries(digits).reduce<Record<string, string>>(
        (map, [digit, string]) => Object.assign(map, { [string]: digit }),
        {},
      );

      return (
        sum +
        parseInt(
          output.reduce((string, digit) => `${string}${segmentsToDigit[digit]}`, ''),
          10,
        )
      );
    }, 0);
