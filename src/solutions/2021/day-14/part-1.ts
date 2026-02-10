const calculatePolymer = (
  pairFrequencies: Record<string, number>,
  rules: Record<string, [string, string]>,
  step: number,
) => {
  if (step === 0) {
    return pairFrequencies;
  }

  const newPairFrequencies: Record<string, number> = {};
  Object.entries(pairFrequencies).forEach(([pair, frequency]) => {
    newPairFrequencies[rules[pair][0]] = (newPairFrequencies[rules[pair][0]] || 0) + frequency;
    newPairFrequencies[rules[pair][1]] = (newPairFrequencies[rules[pair][1]] || 0) + frequency;
  });

  return calculatePolymer(newPairFrequencies, rules, step - 1);
};

const calculateElementFrequencies = (
  pairsFrequency: Record<string, number>,
  templateStr: string,
) => {
  const frequencies: Record<string, number> = {};
  Object.entries(pairsFrequency).forEach(([pair, frequency]) => {
    const element = pair.split('')[0];
    frequencies[element] = (frequencies[element] || 0) + frequency;
  });

  const lastElement = templateStr[templateStr.length - 1];
  frequencies[lastElement] = (frequencies[lastElement] || 0) + 1;

  return frequencies;
};

export const solution = (lines: string[]) => {
  const template = lines[0];

  const rules = lines
    .filter((line) => line.includes(' -> '))
    .map<[string, [string, string]]>((rule) => {
      const [pair, element] = rule.split(' -> ');
      const [first, second] = pair.split('');
      return [pair, [`${first}${element}`, `${element}${second}`]];
    })
    .reduce((map, rule) => Object.assign(map, { [rule[0]]: rule[1] }), {});

  const pairFrequencies: Record<string, number> = {};
  for (let i = 0; i < template.length - 1; i += 1) {
    const pair = `${template[i]}${template[i + 1]}`;
    pairFrequencies[pair] = (pairFrequencies[pair] || 0) + 1;
  }

  const pairs = calculatePolymer(pairFrequencies, rules, 10);
  const elements = calculateElementFrequencies(pairs, template);

  return Math.max(...Object.values(elements)) - Math.min(...Object.values(elements));
};
