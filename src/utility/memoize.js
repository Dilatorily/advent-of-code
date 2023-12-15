export default (callback) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const value = callback(...args);
    cache.set(key, value);
    return value;
  };
};
