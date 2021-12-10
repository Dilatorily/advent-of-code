const brackets = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const scoring = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .reduce((score, line) => {
    const stack = [];

    for (let i = 0; i < line.length; i += 1) {
      const chunk = line[i];
      if (Object.values(brackets).includes(chunk)) {
        if (stack.length <= 0) {
          return score + scoring[chunk];
        }

        if (brackets[stack.pop()] !== chunk) {
          return score + scoring[chunk];
        }
      } else {
        stack.push(chunk);
      }
    }

    return score;
  }, 0);
