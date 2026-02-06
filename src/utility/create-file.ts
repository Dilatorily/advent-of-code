import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export default function createFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });

  try {
    readFileSync(path);
  } catch {
    writeFileSync(path, content);
  }
}
