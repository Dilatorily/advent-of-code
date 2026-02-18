import crypto from 'node:crypto';

export const solution = (lines: string[]) => {
  const key = lines[0];

  let index = 1;
  while (index < Number.MAX_SAFE_INTEGER) {
    if (crypto.createHash('md5').update(`${key}${index}`).digest('hex').startsWith('00000')) {
      break;
    }

    index += 1;
  }

  return index;
};
