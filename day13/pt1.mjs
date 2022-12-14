import { readFileSync } from 'fs';

const pairs = readFileSync('./input.txt', 'utf8').split('\n\n').map(pair => pair.split('\n').map(packet => JSON.parse(packet)));

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

console.log(pairs.map(([left, right]) => cmpPackets(left, right))
            .reduce((sum, diff, i) => sum + (diff < 0 ? i + 1 : 0), 0));

// Answer: 6070
