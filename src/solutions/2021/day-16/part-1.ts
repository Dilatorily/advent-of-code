interface LiteralValue {
  bits: string;
  length: number;
  value: number;
}

interface Packet {
  bits?: string;
  length: number;
  subPackets?: Packet[];
  type?: number;
  value?: number;
  version: number;
}

const convertHexadecimalToBinary = (string: string) => {
  const hexadecimal: Record<string, string> = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
  };

  return string
    .split('')
    .map((character) => hexadecimal[character.toLocaleUpperCase()])
    .join('');
};

const decodeLiteralValue = (string: string): LiteralValue => {
  const group = string.slice(0, 5);
  const bits = group.slice(1);

  if (group.startsWith('0')) {
    return { bits, length: 5, value: parseInt(bits, 2) };
  }

  if (group.startsWith('1')) {
    const nextGroup = decodeLiteralValue(string.slice(5));
    return {
      bits: `${bits}${nextGroup.bits}`,
      length: nextGroup.length + 5,
      value: parseInt(`${bits}${nextGroup.bits}`, 2),
    };
  }

  throw new Error('Invalid bit!');
};

const decodePacket = (string: string) => {
  const version = parseInt(string.slice(0, 3), 2);
  const type = parseInt(string.slice(3, 6), 2);

  if (type === 4) {
    const literal = decodeLiteralValue(string.slice(6));
    const packet = { ...literal, length: 6 + literal.length, version };
    return packet;
  }

  const mode = string.slice(6, 7);

  if (mode === '0') {
    const length = parseInt(string.slice(7, 22), 2);
    const packet = { length: length + 22, subPackets: [] as Packet[], type, version };
    const subPackets = string.slice(22, 22 + length);

    while (packet.subPackets.reduce((sum, subPacket) => sum + subPacket.length, 0) < length) {
      const subPacketsLength = packet.subPackets.reduce(
        (sum, subPacket) => sum + subPacket.length,
        0,
      );
      packet.subPackets.push(decodePacket(subPackets.slice(subPacketsLength)));
    }

    return packet;
  }

  if (mode === '1') {
    const length = parseInt(string.slice(7, 18), 2);
    const packet = { length: 0, subPackets: [] as Packet[], type, version };
    const subPackets = string.slice(18);

    while (packet.subPackets.length < length) {
      const subPacketsLength = packet.subPackets.reduce(
        (sum: number, subPacket: Packet) => sum + subPacket.length,
        0,
      );
      packet.subPackets.push(decodePacket(subPackets.slice(subPacketsLength)));
    }
    packet.length = packet.subPackets.reduce(
      (sum: number, subPacket: Packet) => sum + subPacket.length,
      18,
    );

    return packet;
  }

  throw new Error('Invalid mode!');
};

const getPacketVersion = (packet: Packet): number => {
  if (!packet.subPackets) {
    return packet.version;
  }

  return packet.subPackets
    .map((subPacket) => getPacketVersion(subPacket))
    .reduce((sum, version) => sum + version, packet.version);
};

export const solution = (lines: string[]) => {
  return getPacketVersion(decodePacket(convertHexadecimalToBinary(lines[0])));
};
