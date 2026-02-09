export const memoize = <T>(callback: (...args: unknown[]) => T) => {
  const cache = new Map<string, T>();
  return (...args: unknown[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as T;
    }

    const value = callback(...args);
    cache.set(key, value);
    return value;
  };
};
