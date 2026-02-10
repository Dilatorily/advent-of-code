type Vector = [number, number, number];
type Rotation = [[number, number, number], [number, number, number], [number, number, number]];
interface StandardizedScanner {
  beacons: Vector[];
  origin: Vector;
}

const rotations: Rotation[] = [
  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ],
  [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ],
  [
    [1, 0, 0],
    [0, 0, 1],
    [0, -1, 0],
  ],

  [
    [0, 1, 0],
    [-1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
  ],
  [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, -1],
  ],
  [
    [0, 1, 0],
    [0, 0, -1],
    [-1, 0, 0],
  ],

  [
    [0, 0, 1],
    [0, 1, 0],
    [-1, 0, 0],
  ],
  [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 1],
    [0, -1, 0],
    [1, 0, 0],
  ],
  [
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
  ],

  [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, -1],
  ],
  [
    [-1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
  [
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ],
  [
    [-1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
  ],

  [
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, -1, 0],
    [0, 0, 1],
    [-1, 0, 0],
  ],
  [
    [0, -1, 0],
    [-1, 0, 0],
    [0, 0, -1],
  ],
  [
    [0, -1, 0],
    [0, 0, -1],
    [1, 0, 0],
  ],

  [
    [0, 0, -1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  [
    [0, 0, -1],
    [-1, 0, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, -1],
    [0, -1, 0],
    [-1, 0, 0],
  ],
  [
    [0, 0, -1],
    [1, 0, 0],
    [0, -1, 0],
  ],
];

const addVectors = (vector1: Vector, vector2: Vector) =>
  [vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]] as Vector;

const substractVectors = (vector1: Vector, vector2: Vector) =>
  addVectors(vector1, [-vector2[0], -vector2[1], -vector2[2]]);

const compareVectors = (vector1: Vector, vector2: Vector) =>
  vector1[0] === vector2[0] && vector1[1] === vector2[1] && vector1[2] === vector2[2];

const rotateVector = (rotation: Rotation, vector: Vector) =>
  [
    rotation[0][0] * vector[0] + rotation[0][1] * vector[1] + rotation[0][2] * vector[2],
    rotation[1][0] * vector[0] + rotation[1][1] * vector[1] + rotation[1][2] * vector[2],
    rotation[2][0] * vector[0] + rotation[2][1] * vector[1] + rotation[2][2] * vector[2],
  ] as Vector;

const manhattan = (vector1: Vector, vector2: Vector) => {
  const delta = substractVectors(vector1, vector2);
  return Math.abs(delta[0]) + Math.abs(delta[1]) + Math.abs(delta[2]);
};

const findCommonBeacons = (beacons1: Vector[], beacons2: Vector[]) => {
  for (const rotation of rotations) {
    const rotatedBeacons2 = beacons2.map((beacon) => rotateVector(rotation, beacon));

    for (const beacon1 of beacons1) {
      for (const beacon2 of rotatedBeacons2) {
        const translation = substractVectors(beacon1, beacon2);
        const translatedBeacons2 = rotatedBeacons2.map((b2) => addVectors(b2, translation));

        if (
          beacons1.filter((b1) => translatedBeacons2.find((b2) => compareVectors(b1, b2))).length >=
          12
        ) {
          return { beacons: translatedBeacons2, origin: translation };
        }
      }
    }
  }

  return false;
};

const processScanners = (scanners: Vector[][]) => {
  const standardizedScanners: Record<number, StandardizedScanner | undefined> = {
    0: { beacons: scanners[0], origin: [0, 0, 0] },
  };
  const matched: Record<number, boolean> = {};

  while (Object.keys(standardizedScanners).length < scanners.length) {
    Object.keys(standardizedScanners).forEach((i) => {
      const idx = parseInt(i, 10);
      if (!matched[idx]) {
        for (let j = 0; j < scanners.length; j += 1) {
          if (idx !== j && !standardizedScanners[j]) {
            const commonBeacons = findCommonBeacons(
              standardizedScanners[idx]?.beacons ?? [],
              scanners[j],
            );
            if (commonBeacons) {
              standardizedScanners[j] = commonBeacons;
            }
          }
        }
        matched[idx] = true;
      }
    });
  }

  let maximum = -Infinity;
  for (let i = 0; i < scanners.length; i += 1) {
    for (let j = 0; j < scanners.length; j += 1) {
      if (i < j) {
        const distance = manhattan(
          standardizedScanners[i]?.origin ?? [0, 0, 0],
          standardizedScanners[j]?.origin ?? [0, 0, 0],
        );
        if (distance > maximum) {
          maximum = distance;
        }
      }
    }
  }

  return maximum;
};

export const solution = (lines: string[]) => {
  const scanners = lines
    .join('\n')
    .split('\n\n')
    .map((scanner) =>
      scanner
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .map(
          (coordinates) => coordinates.split(',').map((number) => parseInt(number, 10)) as Vector,
        ),
    );

  return processScanners(scanners);
};
