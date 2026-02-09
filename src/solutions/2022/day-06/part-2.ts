export const solution = (lines: string[]) => {
  const maximum = 14;

  return (
    lines[0].split('').findIndex((_, index, buffer) => {
      if (index < maximum) {
        return false;
      }

      const set = new Set<string>();

      for (let i = 0; i < maximum; i += 1) {
        set.add(buffer[index - i]);
      }

      return set.size === maximum;
    }) + 1
  );
};
