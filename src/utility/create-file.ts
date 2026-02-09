import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const createFile = (path: string, content: string) => {
  mkdirSync(dirname(path), { recursive: true });

  try {
    readFileSync(path);
  } catch {
    writeFileSync(path, content);
  }
};
