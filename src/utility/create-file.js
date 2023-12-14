import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export default (path, content) => {
  mkdirSync(dirname(path), { recursive: true });

  try {
    readFileSync(path);
  } catch {
    writeFileSync(path, content);
  }
};
