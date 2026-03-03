import { jsonParse } from '#dilatorily/advent-of-code/utility/json-parse';

const jsonSum = (json: unknown): number => {
  if (typeof json === 'number') {
    return json;
  }

  if (Array.isArray(json)) {
    return json.reduce((sum: number, item: unknown) => sum + jsonSum(item), 0);
  }

  if (typeof json === 'object' && json !== null) {
    return Object.values(json).reduce((sum: number, value: unknown) => sum + jsonSum(value), 0);
  }

  return 0;
};

export const solution = (lines: string[]) => jsonSum(jsonParse<unknown>(lines[0]));
