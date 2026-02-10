export const solution = (lines: string[]) => {
  const data = lines.map((string) => Number.parseInt(string.split(':')[1].replace(/\s+/g, ''), 10));

  const getRecordBreaks = ({ distance, time }: { distance: number; time: number }) => {
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
  };

  return getRecordBreaks({ distance: data[1], time: data[0] });
};
