export const stringToCharArray = (string: string) =>
  Iterator.from(new Intl.Segmenter().segment(string))
    .map(({ segment }) => segment)
    .toArray();
