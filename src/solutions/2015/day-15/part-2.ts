import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

interface Ingredient {
  calories: number;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
}

const TOTAL_TEASPOONS = 100;

const generatePermutations = (teaspoons: number, totalIngredients: number) => {
  if (totalIngredients === 1) {
    return [[teaspoons]];
  }

  const permutations: number[][] = [];
  for (let index = 0; index <= teaspoons; ++index) {
    for (const permutation of generatePermutations(teaspoons - index, totalIngredients - 1)) {
      permutations.push([index, ...permutation]);
    }
  }

  return permutations;
};

export const solution = (lines: string[]) => {
  const ingredients: Record<string, Ingredient> = lines.reduce((ingredients, line) => {
    const [ingredient, properties] = line.split(': capacity ');
    const [capacity, durabilityString] = properties.split(', durability ');
    const [durability, flavorString] = durabilityString.split(', flavor ');
    const [flavor, textureString] = flavorString.split(', texture ');
    const [texture, calories] = textureString.split(', calories ');
    return Object.assign(ingredients, {
      [ingredient]: {
        calories: toNumber(calories),
        capacity: toNumber(capacity),
        durability: toNumber(durability),
        flavor: toNumber(flavor),
        texture: toNumber(texture),
      },
    });
  }, {});

  let maximumScore = Number.MIN_SAFE_INTEGER;
  generatePermutations(TOTAL_TEASPOONS, Object.keys(ingredients).length).forEach((permutation) => {
    const capacity = Math.max(
      permutation.reduce((capacity, teaspoons, ingredientIndex) => {
        const ingredient = Object.keys(ingredients)[ingredientIndex];
        return capacity + ingredients[ingredient].capacity * teaspoons;
      }, 0),
      0,
    );
    const durability = Math.max(
      permutation.reduce((durability, teaspoons, ingredientIndex) => {
        const ingredient = Object.keys(ingredients)[ingredientIndex];
        return durability + ingredients[ingredient].durability * teaspoons;
      }, 0),
      0,
    );
    const flavor = Math.max(
      permutation.reduce((flavor, teaspoons, ingredientIndex) => {
        const ingredient = Object.keys(ingredients)[ingredientIndex];
        return flavor + ingredients[ingredient].flavor * teaspoons;
      }, 0),
      0,
    );
    const texture = Math.max(
      permutation.reduce((texture, teaspoons, ingredientIndex) => {
        const ingredient = Object.keys(ingredients)[ingredientIndex];
        return texture + ingredients[ingredient].texture * teaspoons;
      }, 0),
      0,
    );
    const calories = permutation.reduce((calories, teaspoons, ingredientIndex) => {
      const ingredient = Object.keys(ingredients)[ingredientIndex];
      return calories + ingredients[ingredient].calories * teaspoons;
    }, 0);

    if (calories === 500) {
      const score = capacity * durability * flavor * texture;
      maximumScore = Math.max(score, maximumScore);
    }
  });

  return maximumScore;
};
