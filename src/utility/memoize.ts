export default function memoize<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const cache = new Map<string, unknown>();
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const value = callback(...args);
    cache.set(key, value);
    return value;
  }) as T;
}
