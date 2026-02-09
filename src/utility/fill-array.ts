export const fillArray = <T>(length: number, fill: T = '' as T) =>
  Array.from({ length }).map(() => JSON.parse(JSON.stringify(fill)) as T);
