const convertHexadecimalToBinary = (string) => {
  const hexadecimal = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
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

const decodeLiteralValue = (string) => {
  const group = string.slice(0, 5);
  const bits = group.slice(1);

  if (group[0] === '0') {
    return { bits, length: 5, value: parseInt(bits, 2) };
  }

  if (group[0] === '1') {
    const nextGroup = decodeLiteralValue(string.slice(5));
    return {
      bits: `${bits}${nextGroup.bits}`,
      length: nextGroup.length + 5,
      value: parseInt(`${bits}${nextGroup.bits}`, 2),
    };
  }

  throw new Error('Invalid bit!');
};

const decodePacket = (string) => {
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
    const packet = { length: length + 22, type, version, subPackets: [] };
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
    const packet = { type, version, subPackets: [] };
    const subPackets = string.slice(18);

    while (packet.subPackets.length < length) {
      const subPacketsLength = packet.subPackets.reduce(
        (sum, subPacket) => sum + subPacket.length,
        0,
      );
      packet.subPackets.push(decodePacket(subPackets.slice(subPacketsLength)));
    }
    packet.length = packet.subPackets.reduce((sum, subPacket) => sum + subPacket.length, 18);

    return packet;
  }

  throw new Error('Invalid mode!');
};

const getPacketValue = (packet) => {
  if (!packet.subPackets) {
    return packet.value;
  }

  if (packet.type === 0) {
    return packet.subPackets.reduce((sum, subPacket) => sum + getPacketValue(subPacket), 0);
  }

  if (packet.type === 1) {
    return packet.subPackets.reduce((product, subPacket) => product * getPacketValue(subPacket), 1);
  }

  if (packet.type === 2) {
    return Math.min(...packet.subPackets.map((subPacket) => getPacketValue(subPacket)));
  }

  if (packet.type === 3) {
    return Math.max(...packet.subPackets.map((subPacket) => getPacketValue(subPacket)));
  }

  if (packet.type === 5) {
    return getPacketValue(packet.subPackets[0]) > getPacketValue(packet.subPackets[1]) ? 1 : 0;
  }

  if (packet.type === 6) {
    return getPacketValue(packet.subPackets[0]) < getPacketValue(packet.subPackets[1]) ? 1 : 0;
  }

  if (packet.type === 7) {
    return getPacketValue(packet.subPackets[0]) === getPacketValue(packet.subPackets[1]) ? 1 : 0;
  }

  throw new Error('Invalid type!');
};

getPacketValue(decodePacket(convertHexadecimalToBinary(document.querySelector('pre').textContent)));
