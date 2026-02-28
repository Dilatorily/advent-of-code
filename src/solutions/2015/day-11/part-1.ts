import { fillArray } from '#dilatorily/advent-of-code/utility/fill-array';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const ALPHABET_WITHOUT_FORBIDDEN_LETTERS = 'abcdefghjkmnpqrstuvwxyz';
const FORBIDDEN_LETTERS = ['i', 'o', 'l'];

const getNextCharacter = (character: string) =>
  ALPHABET[(ALPHABET.indexOf(character) + 1) % ALPHABET.length];

const generateNextPasswordWithoutForbiddenLetters = (password: string) => {
  const nextPassword: string[] = [];

  for (let index = 0; index < password.length; ++index) {
    if (FORBIDDEN_LETTERS.includes(password[index])) {
      nextPassword.push(
        getNextCharacter(password[index]),
        ...fillArray(password.length - index - 1, ALPHABET_WITHOUT_FORBIDDEN_LETTERS[0]),
      );
      return nextPassword.join('');
    } else {
      nextPassword.push(password[index]);
    }
  }

  for (let index = nextPassword.length - 1; index >= 0; --index) {
    const nextCharacter = getNextCharacter(nextPassword[index]);
    nextPassword[index] = nextCharacter;
    if (nextCharacter !== ALPHABET_WITHOUT_FORBIDDEN_LETTERS[0]) {
      break;
    }
  }

  return nextPassword.join('');
};

const hasForbiddenLetters = (password: string) =>
  FORBIDDEN_LETTERS.some((forbiddenLetter) => password.includes(forbiddenLetter));

const hasIncreasingStraight = (password: string) => {
  for (let index = 0; index < password.length - 2; index += 1) {
    const alphabetIndex = ALPHABET.indexOf(password[index]);
    if (
      alphabetIndex < ALPHABET.length - 2 &&
      password[index + 1] === ALPHABET[alphabetIndex + 1] &&
      password[index + 2] === ALPHABET[alphabetIndex + 2]
    ) {
      return true;
    }
  }

  return false;
};

const hasAtLeastTwoPairsOfLetters = (password: string) => {
  const pairs: Record<string, boolean | undefined> = {};
  for (let index = 0; index < password.length - 1; ++index) {
    const pair = `${password[index]}${password[index + 1]}`;
    if (password[index] === password[index + 1] && !pairs[pair]) {
      pairs[pair] = true;
      index += 1;
    }
  }

  return Object.keys(pairs).length >= 2;
};

const isValidPassword = (password: string) =>
  hasIncreasingStraight(password) &&
  hasAtLeastTwoPairsOfLetters(password) &&
  !hasForbiddenLetters(password);

export const solution = (lines: string[]) => {
  const password = lines[0];

  let nextPassword = generateNextPasswordWithoutForbiddenLetters(password);
  while (!isValidPassword(nextPassword)) {
    nextPassword = generateNextPasswordWithoutForbiddenLetters(nextPassword);
  }

  return nextPassword;
};
