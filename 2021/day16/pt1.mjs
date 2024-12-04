import { lines } from '../../common.mjs';

const rawBits = lines('input')[0]
  .split('')
  .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
  .join('');

const TYPE_LITERAL = 4;

let versionSum = 0;

const getPackets = bits => {
  let i = 0;

  let headPacket;
  let packet = {};
  let parentPacket = {};

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
      }

      packet.version = parseInt(bits.slice(i, i + 3), 2);
      versionSum += packet.version;
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

  return headPacket;
};

getPackets(rawBits);

console.log(versionSum);

// Correct answer: 955
