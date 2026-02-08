const generateMap = (algorithm) => {
  const map = {};
  const limit = 2 ** 9;

  for (let i = 0; i < limit; i += 1) {
    map[i.toString(2).padStart(9, '0')] = algorithm[i];
  }

  return map;
};

const convertPixelsToOutput = (pixels, map) =>
  map[pixels.join('').replaceAll('.', '0').replaceAll('#', '1')];

const getPixelsFromIndices = (image, row, column) => [
  image[row - 1].slice(column - 1, column + 2),
  image[row].slice(column - 1, column + 2),
  image[row + 1].slice(column - 1, column + 2),
];

const expandImage = (image, fill) => [
  Array(image[0].length + 4)
    .fill(fill)
    .join(''),
  Array(image[0].length + 4)
    .fill(fill)
    .join(''),
  ...image.map((row) => `${fill}${fill}${row}${fill}${fill}`),
  Array(image[image.length - 1].length + 4)
    .fill(fill)
    .join(''),
  Array(image[image.length - 1].length + 4)
    .fill(fill)
    .join(''),
];

const processImage = (image, map, steps, step = 0) => {
  if (step === steps) {
    return image;
  }

  const possibleFill = step % 2 === 0 ? map['111111111'] : map['000000000'];
  const newFill = map['000000000'] === '.' ? '.' : possibleFill;
  const expandedImage = expandImage(image, newFill);

  const newImage = [];
  for (let i = 1; i < expandedImage.length - 1; i += 1) {
    const row = expandedImage[i];
    newImage.push([]);
    for (let j = 1; j < row.length - 1; j += 1) {
      const pixels = getPixelsFromIndices(expandedImage, i, j);
      newImage[i - 1].push(convertPixelsToOutput(pixels, map));
    }
    newImage[i - 1] = newImage[i - 1].join('');
  }

  return processImage(newImage, map, steps, step + 1);
};

const countLitPixels = (algorithm, input, steps) => {
  const map = generateMap(algorithm);
  const image = processImage(input, map, steps);
  console.log(image);

  return image.join('').replaceAll('.', '').length;
};

const algorithm = document.querySelector('pre').textContent.split('\n\n')[0];
const input = document.querySelector('pre').textContent.split('\n\n')[1].split('\n').slice(0, -1);

countLitPixels(algorithm, input, 50);
