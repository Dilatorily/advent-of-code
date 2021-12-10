const brackets = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const scoring = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const scores = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .filter((line) => {
    const stack = [];

    for (let i = 0; i < line.length; i += 1) {
      const chunk = line[i];
      if (Object.values(brackets).includes(chunk)) {
        if (stack.length <= 0) {
          return false;
        }

        if (brackets[stack.pop()] !== chunk) {
          return false;
        }
      } else {
        stack.push(chunk);
      }
    }

    return stack.length > 0;
  })
  .map((line) => {
    const stack = [];

    for (let i = 0; i < line.length; i += 1) {
      const chunk = line[i];
      if (Object.values(brackets).includes(chunk)) {
        stack.pop();
      } else {
        stack.push(chunk);
      }
    }

    let score = 0;
    while (stack.length > 0) {
      score *= 5;
      score += scoring[brackets[stack.pop()]];
    }

    return score;
  })
  .sort((a, b) => b - a);

console.log(scores[Math.floor(scores.length / 2)]);
