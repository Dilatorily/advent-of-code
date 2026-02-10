const HAND_LENGTH = 5;
const ORDERED_CARDS = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
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
  const cardCounts: Record<string, number> = ORDERED_CARDS.reduce(
    (counts, card) => Object.assign(counts, { [card]: 0 }),
    {},
  );

  hand.split('').forEach((card) => {
    cardCounts[card] += 1;
  });

  // Five of a kind
  // Four of a kind + J
  // Three of a kind + 2J
  // Pair + 3J
  // High card + 4J
  if (
    Object.values(cardCounts).find((count) => count === 5) ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 4) &&
      cardCounts.J === 1) ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 3) &&
      cardCounts.J === 2) ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 2) &&
      cardCounts.J === 3) ||
    cardCounts.J === 4
  ) {
    return ORDERED_HAND_TYPES[0];
  }

  // Four of a kind
  // Three of a kind + J
  // Pair + 2J
  // High card + 3J
  if (
    Object.values(cardCounts).find((count) => count === 4) ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 3) &&
      cardCounts.J === 1) ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 2) &&
      cardCounts.J === 2) ||
    cardCounts.J === 3
  ) {
    return ORDERED_HAND_TYPES[1];
  }

  // Three of a kind + pair
  // Two pairs + J
  if (
    (Object.values(cardCounts).find((count) => count === 3) &&
      Object.values(cardCounts).find((count) => count === 2)) ||
    (Object.values(cardCounts).filter((count) => count === 2).length === 2 && cardCounts.J === 1)
  ) {
    return ORDERED_HAND_TYPES[2];
  }

  // Three of a kind
  // Pair + J
  // High card + 2J
  if (
    Object.values(cardCounts).find((count) => count === 3) ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 2) &&
      cardCounts.J === 1) ||
    cardCounts.J === 2
  ) {
    return ORDERED_HAND_TYPES[3];
  }

  // Two pairs
  // Pair + high card + J
  if (
    Object.values(cardCounts).filter((count) => count === 2).length === 2 ||
    (Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 2) &&
      Object.entries(cardCounts).find(([card, count]) => card !== 'J' && count === 1) &&
      cardCounts.J === 1)
  ) {
    return ORDERED_HAND_TYPES[4];
  }

  // Pair
  // High card + J
  if (Object.values(cardCounts).find((count) => count === 2) || cardCounts.J === 1) {
    return ORDERED_HAND_TYPES[5];
  }

  // High card
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
