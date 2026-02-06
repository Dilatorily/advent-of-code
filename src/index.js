import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import clipboardy from 'clipboardy';
import createFile from './utility/create-file.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const { values } = parseArgs({
  options: {
    date: { short: 'd', type: 'string' },
    part: { short: 'p', type: 'string' },
  },
});
const date = new Date(values.date);
const year = date.getUTCFullYear();
const day = date.getUTCDate();

if (!['1', '2'].includes(values.part)) {
  [
    {
      content: `export default (input) => {
  const lines = input.split('\\n');
  return lines.length;
};
`,
      name: 'part-1.js',
    },
    {
      content: `export default (input) => {
  const lines = input.split('\\n');
  return lines.length;
};
`,
      name: 'part-2.js',
    },
    {
      content: `import part1 from './part-1.js';

describe('${year}-12-${day} part 1', () => {
  it("returns the example's solution", () => {
    const input = \`\`;
    const output = 0;

    const results = part1(input);
    expect(results).toBe(output);
  });
});
`,
      name: 'part-1.test.js',
    },
    {
      content: `import part2 from './part-2.js';

describe('${year}-12-${day} part 2', () => {
  it("returns the example's solution", () => {
    const input = \`\`;
    const output = 0;

    const results = part2(input);
    expect(results).toBe(output);
  });
});
`,
      name: 'part-2.test.js',
    },
  ].forEach(({ content = '', name }) => {
    createFile(join(dirname, `${year}`, `day-${day}`, name), content);
  });
} else {
  const session = readFileSync(join(dirname, '..', '.session'), { encoding: 'utf-8' });
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: { Cookie: `session=${session}` },
  });
  const input = (await response.text()).slice(0, -1);

  const { default: solution } = await import(`./${year}/day-${day}/part-${values.part}.js`);
  const output = solution(input);
  clipboardy.writeSync(`${output}`);
  console.log(output);
}
