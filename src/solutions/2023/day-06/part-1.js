const data = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((string) =>
    string
      .split(':')[1]
      .trim()
      .split(/\s+/)
      .map((number) => Number.parseInt(number, 10)),
  );
data[0]
  .map((time, index) => ({ distance: data[1][index], time }))
  .map(({ distance, time }) => {
    let recordBreaks = 0;
    let hasBrokenRecord = false;

    for (let hold = 1; hold <= time; hold += 1) {
      const travelledDistance = hold * (time - hold);
      if (travelledDistance > distance) {
        recordBreaks += 1;
        hasBrokenRecord = true;
      } else if (hasBrokenRecord) {
        break;
      }
    }

    return recordBreaks;
  })
  .reduce((product, numbers) => product * numbers, 1);
