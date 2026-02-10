const brackets: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const scoring: Record<string, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

export const solution = (lines: string[]) => {
  const scores = lines
    .filter((line) => {
      const stack: string[] = [];

      for (const chunk of line) {
        if (Object.values(brackets).includes(chunk)) {
          if (stack.length <= 0) {
            return false;
          }

          if (brackets[stack.pop() ?? ''] !== chunk) {
            return false;
          }
        } else {
          stack.push(chunk);
        }
      }

      return stack.length > 0;
    })
    .map((line) => {
      const stack: string[] = [];

      for (const chunk of line) {
        if (Object.values(brackets).includes(chunk)) {
          stack.pop();
        } else {
          stack.push(chunk);
        }
      }

      let score = 0;
      while (stack.length > 0) {
        score *= 5;
        score += scoring[brackets[stack.pop() ?? '']];
      }

      return score;
    })
    .sort((a, b) => b - a);

  return scores[Math.floor(scores.length / 2)];
};
