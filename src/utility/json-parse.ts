export const jsonParse = <T>(
  value: string,
  {
    fallback = undefined as T,
    reviver,
  }: { fallback?: T; reviver?: Parameters<typeof JSON.parse>[1] } = {},
) => {
  try {
    return JSON.parse(value, reviver) as T;
  } catch {
    return fallback;
  }
};
