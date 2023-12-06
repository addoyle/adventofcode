import { inspect } from 'node:util';

import { lines } from '../../common.mjs';

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const nodes = [];
const inputLines = lines('sample.txt');
const path = [...inputLines.pop().match(/[A-Z]+|[0-9]+/g)];
inputLines.pop();

const turn = (cur, dir) => (cur + dir > 3 ? 0 : cur + dir < 0 ? 3 : cur + dir);

class Node {
  x;
  y;
  open;
  nbs = [];

  constructor() {
    [this.x, this.y, this.open] = [...arguments];
  }

  get right() {
    return this.nbs[RIGHT];
  }
  set right(node) {
    this.nbs[RIGHT] = node;
  }
  get down() {
    return this.nbs[DOWN];
  }
  set down(node) {
    this.nbs[DOWN] = node;
  }
  get left() {
    return this.nbs[LEFT];
  }
  set left(node) {
    this.nbs[LEFT] = node;
  }
  get up() {
    return this.nbs[UP];
  }
  set up(node) {
    this.nbs[UP] = node;
  }

  // [y, x]
  get faceCoord() {
    return [Math.floor(this.y / cubeSize), Math.floor(this.x / cubeSize)];
  }

  get faceKey() {
    return `${this.faceCoord[0]}-${this.faceCoord[1]}`;
  }

  toString() {
    return inspect(this, { breakLength: Infinity, getters: true });
  }
}

class Face {
  x;
  y;
  dir;
  nw;
  static faces = {};

  constructor(node) {
    [this.y, this.x] = node.faceCoord;
    this.nw = nodes[this.y * cubeSize][this.x * cubeSize];
    this.se = nodes[(this.y + 1) * cubeSize - 1][(this.x + 1) * cubeSize - 1];
    this.dir = UP;
  }

  #lazyload(node) {
    if (node) {
      return Face.faces[node.faceKey] || (Face.faces[node.faceKey] = new Face(node));
    }
  }

  // Lazily load neighbors to avoid stack overflow
  get right() {
    return this.#lazyload(this.se.right);
  }
  get down() {
    return this.#lazyload(this.se.down);
  }
  get left() {
    return this.#lazyload(this.nw.left);
  }
  get up() {
    return this.#lazyload(this.nw.up);
  }

  get neighbors() {
    return [this.right, this.down, this.left, this.up];
  }

  get dirRight() {}
  get dirDown() {}
  get dirLeft() {}
  get dirUp() {}

  rotate() {
    this.dir = turn(this.dir, 1);
  }
  rotateCounter() {
    this.dir = turn(this.dir, -1);
  }
}

class Cube {
  up;
  down;
  north;
  south;
  east;
  west;
  #history = [];

  constructor(up) {
    this.up = up;
    this.#positionFaces();
  }

  rollNorth() {
    const up = this.up;
    this.up = this.south;
    this.south = this.down;
    this.down = this.north;
    this.north = up;

    this.down?.rotate();
    this.down?.rotate();
    this.north?.rotate();
    this.north?.rotate();
    this.east?.rotate();
    this.west?.rotateCounter();

    this.#history.push('rollSouth');
  }

  rollSouth() {
    const up = this.up;
    this.up = this.north;
    this.north = this.down;
    this.down = this.south;
    this.south = up;

    this.up?.rotate();
    this.up?.rotate();
    this.north?.rotate();
    this.north?.rotate();
    this.east?.rotate();
    this.west?.rotateCounter();

    this.#history.push('rollNorth');
  }

  rollWest() {
    const up = this.up;
    this.up = this.east;
    this.east = this.down;
    this.down = this.west;
    this.west = up;

    this.up?.rotate();
    this.down?.rotate();
    this.north?.rotate();
    this.south?.rotateCounter();
    this.east?.rotate();
    this.west?.rotate();

    this.#history.push('rollEast');
  }

  rollEast() {
    const up = this.up;
    this.up = this.west;
    this.west = this.down;
    this.down = this.east;
    this.east = up;

    this.up?.rotateCounter();
    this.down?.rotateCounter();
    this.north?.rotateCounter();
    this.south?.rotate();
    this.east?.rotateCounter();
    this.west?.rotateCounter();

    this.#history.push('rollWest');
  }

  spin() {
    const west = this.west;
    this.west = this.south;
    this.south = this.east;
    this.east = this.north;
    this.north = west;

    this.up?.rotate();
    this.down?.rotateCounter();

    this.#history.push('spinCounter');
  }

  spinCounter() {
    const west = this.west;
    this.west = this.north;
    this.north = this.east;
    this.east = this.south;
    this.south = west;

    this.up?.rotateCounter();
    this.down?.rotate();

    this.#history.push('spin');
  }

  #unroll() {
    this.#history.length && this[this.#history.pop()]();
    this.#history.pop();
  }

  #positionFaces() {
    if (this.length === 6) {
      this.#history = [];
      return;
    }

    if (this.up.left && !this.west) {
      this.west = this.up.left;
      this.west.rotate();
      this.rollEast();
    } else if (this.up.up && !this.north) {
      this.north = this.up.up;
      this.north.rotate();
      this.north.rotate();
      this.rollSouth();
    } else if (this.up.right && !this.east) {
      this.east = this.up.right;
      this.east.rotateCounter();
      this.rollWest();
    } else if (this.up.down && !this.south) {
      this.south = this.up.down;
      this.rollNorth();
    } else {
      this.#unroll();
    }

    this.#positionFaces();
  }

  get length() {
    return [this.up, this.down, this.north, this.south, this.east, this.west].filter(Boolean).length;
  }
}

// Build and parse nodes
inputLines.forEach((row, y) => {
  nodes.push([]);
  row.split('').forEach((c, x) => {
    if (c !== ' ') {
      const node = new Node(x, y, c === '.');
      nodes[y][x] = node;

      if (nodes[y - 1] && nodes[y - 1][x]) {
        nodes[y - 1][x].down = node;
        node.up = nodes[y - 1][x];
      }
      if (nodes[y][x - 1]) {
        nodes[y][x - 1].right = node;
        node.left = nodes[y][x - 1];
      }
    }
  });
});

// Calculate cube face size. Assumed to be square
const cubeSize = nodes.map(r => r.filter(Boolean).length).reduce((min, r) => Math.min(min, r), nodes.length);

let loc = nodes.find(Boolean).find(Boolean);
let dir = RIGHT;

const cube = new Cube(new Face(loc));

// Start walking
path.forEach(a => {
  // Turn
  if (['L', 'R'].includes(a)) {
    dir = turn(dir, a === 'L' ? -1 : 1);
  }
  // Walk
  else {
    const steps = parseInt(a);
    for (let s = 0; s < steps; s++) {
      if (!loc.nbs[dir].open) {
        break;
      }
      loc = loc.nbs[dir];
    }
  }
});

console.log((loc.y + 1) * 1000 + (loc.x + 1) * 4 + dir);

// Answer:
