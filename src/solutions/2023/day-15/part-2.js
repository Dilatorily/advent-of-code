import { fillArray } from '#dilatorily/advent-of-code/utility/fill-array';
import { sum } from '#dilatorily/advent-of-code/utility/sum';
import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const boxes = fillArray(256, []);

const hash = (string) =>
  string.split('').reduce((value, character) => {
    let newValue = value;

    newValue += character.charCodeAt();
    newValue *= 17;
    newValue %= 256;

    return newValue;
  }, 0);

const executeStep = (step) => {
  if (step.match(/-/)) {
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

  if (step.match(/=/)) {
    const [label, focalLength] = step.split('=');
    const labelHash = hash(label);
    const lensIndex = boxes[labelHash].findIndex((lens) => lens.label === label);
    const lens = { focalLength: toNumber(focalLength), label };

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
};

export default (input) => {
  const steps = input.split(',');

  steps.forEach(executeStep);

  const focusingPower = boxes
    .map(
      (box, boxIndex) =>
        box
          .map(({ focalLength }, lensIndex) => focalLength * (lensIndex + 1))
          .reduce(sum, 0) *
        (boxIndex + 1),
    )
    .reduce(sum);

  return focusingPower;
};
