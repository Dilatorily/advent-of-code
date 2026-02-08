const rotations = [
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

const addVectors = (vector1, vector2) => [
  vector1[0] + vector2[0],
  vector1[1] + vector2[1],
  vector1[2] + vector2[2],
];

const substractVectors = (vector1, vector2) =>
  addVectors(vector1, [-vector2[0], -vector2[1], -vector2[2]]);

const compareVectors = (vector1, vector2) =>
  vector1[0] === vector2[0] && vector1[1] === vector2[1] && vector1[2] === vector2[2];

const rotateVector = (rotation, vector) => [
  rotation[0][0] * vector[0] + rotation[0][1] * vector[1] + rotation[0][2] * vector[2],
  rotation[1][0] * vector[0] + rotation[1][1] * vector[1] + rotation[1][2] * vector[2],
  rotation[2][0] * vector[0] + rotation[2][1] * vector[1] + rotation[2][2] * vector[2],
];

const manhattan = (vector1, vector2) => {
  const delta = substractVectors(vector1, vector2);
  return Math.abs(delta[0]) + Math.abs(delta[1]) + Math.abs(delta[2]);
};

const findCommonBeacons = (beacons1, beacons2) => {
  for (let i = 0; i < rotations.length; i += 1) {
    const rotation = rotations[i];
    const rotatedBeacons2 = beacons2.map((beacon) => rotateVector(rotation, beacon));

    for (let j = 0; j < beacons1.length; j += 1) {
      const beacon1 = beacons1[j];

      for (let k = 0; k < rotatedBeacons2.length; k += 1) {
        const beacon2 = rotatedBeacons2[k];

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

const processScanners = (scanners) => {
  const standardizedScanners = { 0: { beacons: scanners[0], origin: [0, 0, 0] } };
  const matched = {};

  while (Object.keys(standardizedScanners).length < scanners.length) {
    Object.keys(standardizedScanners).forEach((i) => {
      if (!matched[i]) {
        for (let j = 0; j < scanners.length; j += 1) {
          if (i !== j && !standardizedScanners[j]) {
            const commonBeacons = findCommonBeacons(standardizedScanners[i].beacons, scanners[j]);
            if (commonBeacons) {
              standardizedScanners[j] = commonBeacons;
            }
          }
        }
        matched[i] = true;
      }
    });
  }

  let maximum = -Infinity;
  for (let i = 0; i < scanners.length; i += 1) {
    for (let j = 0; j < scanners.length; j += 1) {
      if (i < j) {
        const distance = manhattan(standardizedScanners[i].origin, standardizedScanners[j].origin);
        if (distance > maximum) {
          maximum = distance;
        }
      }
    }
  }

  return maximum;
};

const scanners = document
  .querySelector('pre')
  .textContent.split('\n\n')
  .map((scanner) =>
    scanner
      .split('\n')
      .slice(1)
      .filter(Boolean)
      .map((coordinates) => coordinates.split(',').map((number) => parseInt(number, 10))),
  );

processScanners(scanners);
