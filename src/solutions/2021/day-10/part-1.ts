const brackets: Record<string, string> = {
  '(': ')',
  '<': '>',
  '[': ']',
  '{': '}',
};

const scoring: Record<string, number> = {
  ')': 3,
  '>': 25137,
  ']': 57,
  '}': 1197,
};

export const solution = (lines: string[]): number =>
  lines.reduce((score, line) => {
    const stack: string[] = [];

    for (const chunk of line) {
      if (Object.values(brackets).includes(chunk)) {
        if (stack.length <= 0) {
          return score + scoring[chunk];
        }

        if (brackets[stack.pop() ?? ''] !== chunk) {
          return score + scoring[chunk];
        }
      } else {
        stack.push(chunk);
      }
    }

    return score;
  }, 0);
