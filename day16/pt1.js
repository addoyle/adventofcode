const common = require('../common.js');

const rawBits = common
  .lines('sample2')[0]
  .split('')
  .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
  .join('');

const TYPE_LITERAL = 4;

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
    if (!packet.version) {
      // Set the head packet
      if (!headPacket) {
        headPacket = packet;
      }

      if (
        parentPacket.version &&
        parentPacket.subPackets.length <= parentPacket.total
      ) {
        parentPacket.subPackets.push(packet);
      }

      packet.version = parseInt(bits.slice(i, i + 3), 2);
      i += 3;
    }

    // No type yet, grab next 3 bits
    if (!packet.type) {
      packet.type = parseInt(bits.slice(i, i + 3), 2);
      i += 3;

      if (packet.type === TYPE_LITERAL) {
        packet.groups = [];
        packet.hasMore = true;
      }
      // Anything else, operator
      else {
        const newPacket = {};
        parentPacket = packet;
        packet = newPacket;
        parentPacket.subPackets = [];
        parentPacket.isNumPackets = +bits[i++];

        // Next 11 bits contains the number of packets
        if (parentPacket.isNumPackets) {
          parentPacket.total = parseInt(bits.slice(i, i + 11), 2);
          i += 11;
        }
        // Next 15 bits represents the length of bits containing packets
        else {
          const length = parseInt(bits.slice(i, i + 15), 2);
          i += 15;
          parentPacket.subPackets = getPackets(bits.slice(i, i + length));
          i += length;
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
        packet = {};
      }
    }
  }

  return headPacket;
};

console.log(getPackets(rawBits));

// Correct answer:
