const template = document.querySelector('pre').textContent.split('\n')[0];

const rules = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter((rule) => rule.includes(' -> '))
  .map((rule) => {
    const [pair, element] = rule.split(' -> ');
    const [first, second] = pair.split('');
    return [pair, [`${first}${element}`, `${element}${second}`]];
  })
  .reduce((map, rule) => Object.assign(map, { [rule[0]]: rule[1] }), {});

const calculatePolymer = (pairFrequencies, step) => {
  if (step === 0) {
    return pairFrequencies;
  }

  const newPairFrequencies = {};
  Object.entries(pairFrequencies).forEach(([pair, frequency]) => {
    newPairFrequencies[rules[pair][0]] = (newPairFrequencies[rules[pair][0]] || 0) + frequency;
    newPairFrequencies[rules[pair][1]] = (newPairFrequencies[rules[pair][1]] || 0) + frequency;
  });

  return calculatePolymer(newPairFrequencies, step - 1);
};

const pairFrequencies = {};
for (let i = 0; i < template.length - 1; i += 1) {
  const pair = `${template[i]}${template[i + 1]}`;
  pairFrequencies[pair] = (pairFrequencies[pair] || 0) + 1;
}

const pairs = calculatePolymer(pairFrequencies, 10);

const calculateElementFrequencies = (pairsFrequency, templateStr) => {
  const frequencies = {};
  Object.entries(pairsFrequency).forEach(([pair, frequency]) => {
    const element = pair.split('')[0];
    frequencies[element] = (frequencies[element] || 0) + frequency;
  });

  const lastElement = templateStr[templateStr.length - 1];
  frequencies[lastElement] = (frequencies[lastElement] || 0) + 1;

  return frequencies;
};

const elements = calculateElementFrequencies(pairs, template);
console.log(Math.max(...Object.values(elements)) - Math.min(...Object.values(elements)));
