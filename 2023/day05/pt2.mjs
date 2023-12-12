import { lines } from '../../common.mjs';

class Node {
  dest;
  src;
  len;
  left;
  right;

  constructor(dest, src, len) {
    this.dest = dest;
    this.src = src;
    this.len = len;
  }

  addLeaf(node) {
    if (node.src < this.src) {
      if (this.left) {
        this.left.addLeaf(node);
      } else {
        this.left = node;
      }
    } else {
      if (this.right) {
        this.right.addLeaf(node);
      } else {
        this.right = node;
      }
    }
  }

  getRanges(key, len, ranges = []) {
    const addRange = (lower, upper, action = (k, l) => ranges.push([k, l])) => {
      if (len > 0 && key >= lower && key < upper) {
        const segKey = key;
        key = Math.min(upper, key + len);
        const segLen = key - segKey;
        len -= segLen;
        action(segKey, segLen);
      }
    };

    if (this.left) {
      addRange(-Infinity, this.left.src);
      addRange(this.left.src, this.left.src + this.left.len, (k, l) => this.left.getRanges(k, l, ranges));
      addRange(this.left.src + this.left.len, this.src);
    } else {
      addRange(-Infinity, this.src);
    }

    addRange(this.src, this.src + this.len, (k, l) => ranges.push([this.dest + (k - this.src), l]));

    if (this.right) {
      addRange(this.src + this.len, this.right.src);
      addRange(this.right.src, this.right.src + this.right.len, (k, l) => this.right.getRanges(k, l, ranges));
      addRange(this.right.src + this.right.len, Infinity);
    } else {
      addRange(this.src + this.len, Infinity);
    }

    return [...new Set(ranges)];
  }
}

const almanac = lines('./input.txt');

const seeds = [
  ...almanac
    .shift()
    .split(':')[1]
    .trim()
    .matchAll(/(\d+) (\d+)/g)
].map(m => m.slice(1, 3).map(n => parseInt(n)));
almanac.shift();

const hops = [];
while (almanac.length) {
  almanac.shift(); // map header
  let hop, conv;
  while ((conv = almanac.shift())) {
    const node = new Node(...conv.split(' ').map(n => parseInt(n)));
    if (!hop) {
      hop = node;
    } else {
      hop.addLeaf(node);
    }
  }
  hops.push(hop);
}

console.log(
  seeds
    .map(seedRange => {
      let ranges = [seedRange];
      hops.forEach(hop => {
        ranges = ranges.map(range => hop.getRanges(...range)).flat();
      });
      return ranges.reduce((min, range) => Math.min(min, range[0]), Infinity);
    })
    .reduce((min, n) => Math.min(min, n), Infinity)
);
