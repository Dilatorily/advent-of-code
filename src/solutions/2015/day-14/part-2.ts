import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

const RACE_DURATION = 2503;

export const solution = (lines: string[], raceDuration = RACE_DURATION) => {
  const reindeers = lines.map((line) => {
    const [name, sentence] = line.split(' can fly ');
    const [speed, flySentence] = sentence.split(' km/s for ');
    const [fly, restSentence] = flySentence.split(' seconds, but then must rest for ');
    const [rest] = restSentence.split(' seconds.');

    return {
      fly: toNumber(fly),
      name,
      rest: toNumber(rest),
      speed: toNumber(speed),
    };
  });

  const race: Record<
    string,
    { distance: number; points: number; remainingFlyTime: number; remainingRestTime: number }
  > = reindeers.reduce(
    (accumulator, { fly, name }) =>
      Object.assign(accumulator, {
        [name]: { distance: 0, points: 0, remainingFlyTime: fly, remainingRestTime: 0 },
      }),
    {},
  );

  for (let seconds = 0; seconds < raceDuration; ++seconds) {
    reindeers.forEach(({ fly, name, rest, speed }) => {
      if (race[name].remainingRestTime > 0) {
        race[name].remainingRestTime -= 1;

        if (race[name].remainingRestTime === 0) {
          race[name].remainingFlyTime = fly;
        }
      } else if (race[name].remainingFlyTime > 0) {
        race[name].remainingFlyTime -= 1;
        race[name].distance += speed;

        if (race[name].remainingFlyTime === 0) {
          race[name].remainingRestTime = rest;
        }
      }
    });

    const maxDistance = Math.max(...Object.values(race).map(({ distance }) => distance));
    reindeers.forEach(({ name }) => {
      if (race[name].distance === maxDistance) {
        race[name].points += 1;
      }
    });
  }

  return Math.max(...Object.values(race).map(({ points }) => points));
};
