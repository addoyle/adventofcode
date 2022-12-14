import { readFileSync } from 'fs';

const packets = readFileSync('./input.txt', 'utf8')
  .split('\n')
  .filter(a => a)
  .map(packet => JSON.parse(packet));

const cmpPackets = (left, right) => {
  // Compare if both ints
  if (!Array.isArray(left) && !Array.isArray(right)) {
    return left - right;
  }

  // Both are arrays, compare
  else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      // Right ran out of stuff first
      if (right[i] === undefined) {
        return 1;
      }

      const res = cmpPackets(left[i], right[i]);
      if (res !== 0) {
        return res;
      }
    }
    // Left ran out of stuff first
    if (left.length < right.length) {
      return -1;
    }
  }

  // Mixed terms
  else if (Array.isArray(left)) {
    return cmpPackets(left, [right]);
  }
  else if (Array.isArray(right)) {
    return cmpPackets([left], right);
  }

  // Default case if everything else fails
  return 0;
}

// Add divider packets
const dividers = [[[2]], [[6]]]
dividers.forEach(d => packets.push(d));

// Sort packets
packets.sort(cmpPackets);

// Find those divider packets
const divStrs = new Set(dividers.map(d => JSON.stringify(d)));
console.log(packets.reduce((decoderKey, packet, i) => decoderKey * (divStrs.has(JSON.stringify(packet)) ? i + 1 : 1), 1));

// Answer: 20758
