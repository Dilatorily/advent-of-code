import { jsonParse } from '#dilatorily/advent-of-code/utility/json-parse';

export const deepCopy = <T>(value: T) => jsonParse<T>(JSON.stringify(value));
