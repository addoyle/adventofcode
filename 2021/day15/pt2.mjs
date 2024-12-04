import { lines } from '../../common.mjs';

const rawBits = lines('sample8')[0]
  .split('')
  .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
  .join('');

const TYPE_SUM = 0;
const TYPE_PRODUCT = 1;
const TYPE_MIN = 2;
const TYPE_MAX = 3;
const TYPE_LITERAL = 4;
const TYPE_GREATER_THAN = 5;
const TYPE_LESS_THAN = 6;
const TYPE_EQUALS = 7;

const getPackets = bits => {
  let i = 0;

  let headPacket;
  let packet = {};
  let parentPacket = {};
  let packets = [];

  while (i < bits.length) {
    // Rest of the bits are 0, nothing left to do
    if (parseInt(bits.slice(i), 2) === 0) {
      break;
    }

    // No version yet, grab next 3 bits
    if (packet.version === undefined) {
      // Set the head packet
      if (!headPacket) {
        headPacket = packet;
      }

      if (parentPacket.version !== undefined) {
        if (parentPacket.subPackets.length <= parentPacket.total) {
          parentPacket.subPackets.push(packet);
        }
      } else {
        packets.push(packet);
      }

      packet.version = parseInt(bits.slice(i, i + 3), 2);
      i += 3;
    }

    // No type yet, grab next 3 bits
    if (packet.type === undefined) {
      packet.type = parseInt(bits.slice(i, i + 3), 2);
      i += 3;

      if (packet.type === TYPE_LITERAL) {
        packet.groups = [];
        packet.hasMore = true;
      }
      // Anything else, operator
      else {
        const isNumPackets = +bits[i++];

        // Next 11 bits contains the number of packets
        if (isNumPackets) {
          packet.subPackets = [];
          packet.total = parseInt(bits.slice(i, i + 11), 2);
          parentPacket = packet;
          packet = {};
          i += 11;
        }
        // Next 15 bits represents the length of bits containing packets
        else {
          const length = parseInt(bits.slice(i, i + 15), 2);
          i += 15;
          packet.subPackets = getPackets(bits.slice(i, i + length));
          i += length;
          packet = {};
        }
      }
    }

    // Grab next group
    if (packet.type === TYPE_LITERAL && packet.hasMore) {
      packet.hasMore = +bits[i++];
      packet.groups.push(bits.slice(i, i + 4));
      i += 4;

      if (!packet.hasMore) {
        packet.value = parseInt(packet.groups.join(''), 2);
        delete packet.groups;
        delete packet.hasMore;
        packet = {};
      }
    }
  }

  return packets;
};

const wrap = value => ({ type: TYPE_LITERAL, value });
const calculate = packet => {
  if (packet.type === TYPE_SUM) {
    const sum = packet.subPackets.reduce((sum, p) => sum + calculate(p).value, 0);
    console.log({ sum });
    return wrap(sum);
  }
  if (packet.type === TYPE_PRODUCT) {
    const prod = packet.subPackets.reduce((prod, p) => prod * calculate(p).value, 1);
    console.log({ prod });
    return wrap(prod);
  }
  if (packet.type === TYPE_MIN) {
    return packet.subPackets.reduce((min, p) => {
      const cp = calculate(p);
      return min.value < cp.value ? min : cp;
    }, wrap(Infinity));
  }
  if (packet.type === TYPE_MAX) {
    return packet.subPackets.reduce((max, p) => {
      const cp = calculate(p);
      return max.value > cp.value ? max : cp;
    }, wrap(-Infinity));
  }
  if (packet.type === TYPE_LITERAL) {
    return packet;
  }
  if (packet.type === TYPE_GREATER_THAN) {
    // return wrap(
    //   calculate(packet.subPackets[0]).value >
    //     calculate(packet.subPackets[1]).value
    //     ? 1
    //     : 0
    // );
    const l = calculate(packet.subPackets[0]);
    const r = calculate(packet.subPackets[1]);
    console.log({ l, r });
    return wrap(l.value > r.value ? 1 : 0);
  }
  if (packet.type === TYPE_LESS_THAN) {
    // return wrap(
    //   calculate(packet.subPackets[0]).value <
    //     calculate(packet.subPackets[1]).value
    //     ? 1
    //     : 0
    // );
    const l = calculate(packet.subPackets[0]);
    const r = calculate(packet.subPackets[1]);
    console.log({ l, r });
    return wrap(l.value < r.value ? 1 : 0);
  }
  if (packet.type === TYPE_EQUALS) {
    const l = calculate(packet.subPackets[0]);
    const r = calculate(packet.subPackets[1]);
    console.log({ l, r });
    return wrap(l.value === r.value ? 1 : 0);
  }
};

const packet = getPackets(rawBits)[0];

// console.log(packet);
console.log(calculate(packet));

// Correct answer:
