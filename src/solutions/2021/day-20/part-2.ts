const generateMap = (algorithm: string) => {
  const map: Record<string, string> = {};
  const limit = 2 ** 9;

  for (let i = 0; i < limit; i += 1) {
    map[i.toString(2).padStart(9, '0')] = algorithm[i];
  }

  return map;
};

const convertPixelsToOutput = (pixels: string[], map: Record<string, string>) =>
  map[pixels.join('').replaceAll('.', '0').replaceAll('#', '1')];

const getPixelsFromIndices = (image: string[], row: number, column: number) => [
  image[row - 1].slice(column - 1, column + 2),
  image[row].slice(column - 1, column + 2),
  image[row + 1].slice(column - 1, column + 2),
];

const expandImage = (image: string[], fill: string) => {
  const topAndBottomRows = [
    Array(image[0].length + 4)
      .fill(fill)
      .join(''),
    Array(image[0].length + 4)
      .fill(fill)
      .join(''),
  ];
  const expandedMiddleRows = image.map((row) => `${fill}${fill}${row}${fill}${fill}`);
  const bottomRows = [
    Array(image[image.length - 1].length + 4)
      .fill(fill)
      .join(''),
    Array(image[image.length - 1].length + 4)
      .fill(fill)
      .join(''),
  ];
  return [...topAndBottomRows, ...expandedMiddleRows, ...bottomRows];
};

const processImage = (image: string[], map: Record<string, string>, steps: number, step = 0) => {
  if (step === steps) {
    return image;
  }

  const possibleFill = step % 2 === 0 ? map['111111111'] : map['000000000'];
  const newFill = map['000000000'] === '.' ? '.' : possibleFill;
  const expandedImage = expandImage(image, newFill);

  const newImage: string[] = [];
  for (let i = 1; i < expandedImage.length - 1; i += 1) {
    const row = expandedImage[i];
    const newRow: string[] = [];
    for (let j = 1; j < row.length - 1; j += 1) {
      const pixels = getPixelsFromIndices(expandedImage, i, j);
      newRow.push(convertPixelsToOutput(pixels, map));
    }
    newImage.push(newRow.join(''));
  }

  return processImage(newImage, map, steps, step + 1);
};

const countLitPixels = (algorithm: string, input: string[], steps: number) => {
  const map = generateMap(algorithm);
  const image = processImage(input, map, steps);
  return image.join('').replaceAll('.', '').length;
};

export const solution = (lines: string[]) => {
  const sections = lines.join('\n').split('\n\n');
  const algorithm = sections[0];
  const input = sections[1].split('\n');

  return countLitPixels(algorithm, input, 50);
};
