import { fillArray } from '#dilatorily/advent-of-code/utility/fill-array';
import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

interface Lens {
  focalLength: number;
  label: string;
}

const hash = (string: string) =>
  string.split('').reduce((value, character) => {
    let newValue = value;

    newValue += character.charCodeAt(0);
    newValue *= 17;
    newValue %= 256;

    return newValue;
  }, 0);

export const solution = (lines: string[]) => {
  const boxes: Lens[][] = fillArray(256, []);
  const steps = lines[0].split(',');

  steps.forEach((step) => {
    if (/-/.exec(step)) {
      const [label] = step.split('-');
      const labelHash = hash(label);
      const lensIndex = boxes[labelHash].findIndex((lens) => lens.label === label);

      if (lensIndex > -1) {
        boxes[labelHash] = [
          ...boxes[labelHash].slice(0, lensIndex),
          ...boxes[labelHash].slice(lensIndex + 1),
        ];
      }
    }

    if (/=/.exec(step)) {
      const [label, focalLength] = step.split('=');
      const labelHash = hash(label);
      const lensIndex = boxes[labelHash].findIndex((lens) => lens.label === label);
      const lens: Lens = { focalLength: toNumber(focalLength), label };

      if (lensIndex > -1) {
        boxes[labelHash] = [
          ...boxes[labelHash].slice(0, lensIndex),
          lens,
          ...boxes[labelHash].slice(lensIndex + 1),
        ];
      } else {
        boxes[labelHash].push(lens);
      }
    }
  });

  const focusingPower = boxes
    .map(
      (box, boxIndex) =>
        box.map(({ focalLength }, lensIndex) => focalLength * (lensIndex + 1)).reduce(sum, 0) *
        (boxIndex + 1),
    )
    .reduce(sum);

  return focusingPower;
};
