import { toNumber } from '#dilatorily/advent-of-code/utility/to-number';

interface BaseWire {
  identifier: string;
  signal?: number;
}

interface AndWire extends BaseWire {
  inputs: [Wire, Wire];
  operation: 'AND';
}

interface LShiftWire extends BaseWire {
  inputs: [Wire, Wire];
  operation: 'LSHIFT';
}

interface NotWire extends BaseWire {
  inputs: Wire;
  operation: 'NOT';
}

interface NumberWire {
  signal: number;
}

interface OrWire extends BaseWire {
  inputs: [Wire, Wire];
  operation: 'OR';
}

interface RShiftWire extends BaseWire {
  inputs: [Wire, Wire];
  operation: 'RSHIFT';
}

interface ValueWire extends BaseWire {
  inputs: Wire;
}

type Wire = AndWire | LShiftWire | NotWire | NumberWire | OrWire | ValueWire | RShiftWire;

const upsertWire = (wire: string, wires: Record<string, Wire | undefined>) => {
  if (Number.isNaN(toNumber(wire))) {
    wires[wire] ??= { identifier: wire } as Wire;
    return wires[wire];
  }

  return { signal: toNumber(wire) };
};

const buildWire = (line: string, wires: Record<string, Wire | undefined>) => {
  const [signal, wire] = line.split(' -> ');
  const inputs = signal.split(' ');
  const baseWire = upsertWire(wire, wires);

  if (inputs.length === 1) {
    const valueWire = baseWire as ValueWire;
    valueWire.inputs = upsertWire(inputs[0], wires);
  } else if (inputs.length === 2) {
    const notWire = baseWire as NotWire;
    notWire.operation = 'NOT';
    notWire.inputs = upsertWire(inputs[1], wires);
  } else if (inputs.length === 3) {
    switch (inputs[1]) {
      case 'AND': {
        const andWire = baseWire as AndWire;
        andWire.operation = 'AND';
        andWire.inputs = [upsertWire(inputs[0], wires), upsertWire(inputs[2], wires)];
        break;
      }
      case 'LSHIFT': {
        const lshiftWire = baseWire as LShiftWire;
        lshiftWire.operation = 'LSHIFT';
        lshiftWire.inputs = [upsertWire(inputs[0], wires), upsertWire(inputs[2], wires)];
        break;
      }
      case 'OR': {
        const orWire = baseWire as OrWire;
        orWire.operation = 'OR';
        orWire.inputs = [upsertWire(inputs[0], wires), upsertWire(inputs[2], wires)];
        break;
      }
      case 'RSHIFT': {
        const rshiftWire = baseWire as RShiftWire;
        rshiftWire.operation = 'RSHIFT';
        rshiftWire.inputs = [upsertWire(inputs[0], wires), upsertWire(inputs[2], wires)];
        break;
      }
    }
  } else {
    throw new Error('Invalid input!');
  }
};

const calculateSignal = (wire: Wire | undefined): number => {
  if (!wire) {
    return 0;
  }

  if ('signal' in wire) {
    return wire.signal ?? 0;
  }

  if (!('operation' in wire)) {
    if (typeof wire.inputs === 'number') {
      wire.signal = wire.inputs & 0xffff;
      return wire.signal;
    }

    wire.signal = calculateSignal(wire.inputs);
    return wire.signal;
  }

  switch (wire.operation) {
    case 'AND':
      wire.signal = calculateSignal(wire.inputs[0]) & calculateSignal(wire.inputs[1]) & 0xffff;
      break;
    case 'LSHIFT':
      wire.signal = (calculateSignal(wire.inputs[0]) << calculateSignal(wire.inputs[1])) & 0xffff;
      break;
    case 'OR':
      wire.signal = (calculateSignal(wire.inputs[0]) | calculateSignal(wire.inputs[1])) & 0xffff;
      break;
    case 'RSHIFT':
      wire.signal = (calculateSignal(wire.inputs[0]) >> calculateSignal(wire.inputs[1])) & 0xffff;
      break;
    case 'NOT':
      wire.signal = ~calculateSignal(wire.inputs) & 0xffff;
      break;
    default:
      throw new Error('Invalid operation!');
  }

  return wire.signal;
};

export const solution = (lines: string[]) => {
  const wires: Record<string, Wire | undefined> = {};

  lines.forEach((line) => {
    buildWire(line, wires);
  });

  return calculateSignal(wires.a);
};
