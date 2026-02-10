export const memoize = <T, P extends unknown[]>(callback: (...args: P) => T) => {
  const cache = new Map<string, T>();
  return (...args: P) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as T;
    }

    const value = callback(...args);
    cache.set(key, value);
    return value;
  };
};
