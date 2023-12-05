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

  getNode(key) {
    if (key >= this.src && key <= this.src + this.len) {
      return this;
    }

    if (this.left && key < this.src) {
      return this.left.getNode(key);
    }
    if (this.right && key > this.src) {
      return this.right.getNode(key);
    }

    return;
  }

  get(key) {
    const node = this.getNode(key);
    return node ? node.dest + (key - node.src) : key;
  }
}

const almanac = lines('./input.txt');

const seeds = almanac
  .shift()
  .split(':')[1]
  .trim()
  .split(' ')
  .map(n => parseInt(n));
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
    .map(seed => {
      let cur = seed;
      hops.forEach(hop => (cur = hop.get(cur)));
      return cur;
    })
    .reduce((min, n) => Math.min(min, n), Infinity)
);
