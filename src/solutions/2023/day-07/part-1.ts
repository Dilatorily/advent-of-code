const HAND_LENGTH = 5;
const ORDERED_CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const ORDERED_HAND_TYPES = [
  'FIVE_OF_A_KIND',
  'FOUR_OF_A_KIND',
  'FULL_HOUSE',
  'THREE_OF_A_KIND',
  'TWO_PAIRS',
  'ONE_PAIR',
  'HIGH_CARD',
];

const getHandType = (hand: string) => {
  const cardCounts = ORDERED_CARDS.reduce<Record<string, number>>(
    (counts, card) => Object.assign(counts, { [card]: 0 }),
    {},
  );

  hand.split('').forEach((card) => {
    cardCounts[card] += 1;
  });

  if (Object.values(cardCounts).find((count) => count === 5)) {
    return ORDERED_HAND_TYPES[0];
  }

  if (Object.values(cardCounts).find((count) => count === 4)) {
    return ORDERED_HAND_TYPES[1];
  }

  if (
    Object.values(cardCounts).find((count) => count === 3) &&
    Object.values(cardCounts).find((count) => count === 2)
  ) {
    return ORDERED_HAND_TYPES[2];
  }

  if (Object.values(cardCounts).find((count) => count === 3)) {
    return ORDERED_HAND_TYPES[3];
  }

  if (Object.values(cardCounts).filter((count) => count === 2).length === 2) {
    return ORDERED_HAND_TYPES[4];
  }

  if (Object.values(cardCounts).find((count) => count === 2)) {
    return ORDERED_HAND_TYPES[5];
  }

  return ORDERED_HAND_TYPES[6];
};

interface HandData {
  bid: number;
  hand: string;
  handType: string;
}

export const solution = (lines: string[]) =>
  lines
    .map((string) => {
      const [hand, bid] = string.split(' ');
      return {
        bid: Number.parseInt(bid, 10),
        hand,
        handType: getHandType(hand),
      };
    })
    .sort((a: HandData, b: HandData) => {
      const handTypeDifference =
        ORDERED_HAND_TYPES.findIndex((handType) => handType === b.handType) -
        ORDERED_HAND_TYPES.findIndex((handType) => handType === a.handType);
      if (handTypeDifference !== 0) {
        return handTypeDifference;
      }

      for (let index = 0; index < HAND_LENGTH; index += 1) {
        const cardDifference =
          ORDERED_CARDS.findIndex((card) => card === b.hand[index]) -
          ORDERED_CARDS.findIndex((card) => card === a.hand[index]);
        if (cardDifference !== 0) {
          return cardDifference;
        }
      }

      return 0;
    })
    .reduce((sum, { bid }, index) => sum + bid * (index + 1), 0);
