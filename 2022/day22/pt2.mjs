import { inspect } from 'node:util';

import { lines } from '../common.mjs';

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const nodes = [];
const inputLines = lines('sample.txt');
const path = [...inputLines.pop().match(/[A-Z]+|[0-9]+/g)];
inputLines.pop();

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

  toString() {
    return inspect(this, { breakLength: Infinity, getters: true });
  }
}

class Face {
  nw;
  ne;
  sw;
  se;
  done = false;
  static faces = {};

  constructor(node) {
    this.nw = nodes[Math.floor(node.y / cubeSize) * cubeSize][Math.floor(node.x / cubeSize) * cubeSize];
    this.ne = nodes[this.nw.y][this.nw.x + cubeSize - 1];
    this.sw = nodes[this.nw.y + cubeSize - 1][this.nw.x];
    this.se = nodes[this.sw.y][this.ne.x];
  }

  #lazyload(node, prop) {
    if (node) {
      let value = new Face(node);
      const key = `${value.nw.x / cubeSize}-${value.nw.y / cubeSize}`;
      if (Face.faces[key]) {
        value = Face.faces[key];
      } else {
        Face.faces[key] = value;
      }
      Object.defineProperty(this, prop, { value });
      return value;
    }
  }

  // Lazily load neighbors to avoid stack overflow
  get right() {
    return this.#lazyload(this.ne.right, 'right');
    // if (this.ne.right) {
    //   const right = new Face(this.ne.right);
    //   Object.defineProperty(this, 'right', {});
    // }
    // return this.right || (this.ne.right && (this.right = new Face(this.ne.right)));
  }
  get down() {
    return this.#lazyload(this.sw.down, 'down');
    // return this.down || (this.sw.down && (this.down = new Face(this.sw.down)));
  }
  get left() {
    return this.#lazyload(this.nw.left, 'left');
    // return this.left || (this.nw.left && (this.left = new Face(this.nw.left)));
  }
  get up() {
    return this.#lazyload(this.nw.up, 'up');
    // return this.up || (this.nw.up && (this.up = new Face(this.nw.up)));
  }

  get isComplete() {
    return this.left && this.up && this.down && this.right;
  }

  connectToFace(edge, face, faceEdge) {
    let tile,
      dir = faceEdge,
      faceTile,
      faceDir = edge;

    if ((edge === 'left' && faceEdge == 'down') || (edge === 'up' && faceEdge === 'right')) {
      tile = this.nw;
      faceTile = face.se;
    } else if ((edge === 'left' && faceEdge === 'up') || (edge === 'down' && faceEdge === 'right')) {
      tile = this.sw;
      faceTile = face.ne;
    } else if ((edge === 'right' && faceEdge === 'down') || (edge === 'up' && faceEdge === 'left')) {
      tile = this.ne;
      faceTile = face.sw;
    } else if ((edge === 'right' && faceEdge === 'up') || (edge === 'down' && faceEdge === 'left')) {
      tile = this.se;
      faceTile = face.nw;
    } else if (edge === faceEdge) {
      if (edge === 'up' || edge === 'down') {
        dir = 'right';
        faceDir = 'left';
      } else {
        dir = 'down';
        faceDir = 'up';
      }

      if (edge === 'up') {
        tile = this.nw;
        faceTile = face.ne;
      } else if (edge === 'down') {
        tile = this.sw;
        faceTile = face.se;
      } else if (edge === 'left') {
        tile = this.nw;
        faceTile = face.sw;
      } else if (edge === 'right') {
        tile = this.ne;
        faceTile = face.se;
      }
    } else {
      // Should be up-down, right-left
      if (edge === 'up' || edge === 'down') {
        dir = faceDir = 'left';
      } else {
        dir = faceDir = 'down';
      }
      if (edge === 'up' && faceEdge === 'down') {
        tile = this.nw;
        faceTile = face.sw;
      } else if (edge === 'down' && faceEdge === 'up') {
        tile = this.sw;
        faceTile = face.nw;
      } else if (edge === 'left' && faceEdge === 'right') {
        tile = this.nw;
        faceTile = face.ne;
      } else if (edge === 'right' && faceEdge === 'left') {
        tile = this.ne;
        faceTile = face.nw;
      }
    }

    for (let i = 0; i < cubeSize; i++, tile = tile[dir], faceTile = faceTile[faceDir]) {
      tile[edge] = faceTile;
      faceTile[faceEdge] = tile;
    }
  }

  toString() {
    return nodes
      .slice(this.nw.y, this.nw.y + cubeSize)
      .map(row =>
        row
          .slice(this.nw.x, this.nw.x + cubeSize)
          .map(n => (n.open ? '.' : '#'))
          .join('')
      )
      .join('\n');
  }
}

class Cube {
  up;
  down;
  north;
  south;
  east;
  west;

  rotateNorth() {
    const up = this.up;
    this.up = this.south;
    this.south = this.down;
    this.down = this.north;
    this.north = up;
  }

  rotateSouth() {
    const up = this.up;
    this.up = this.north;
    this.north = this.down;
    this.down = this.south;
    this.south = up;
  }

  rotateWest() {
    const up = this.up;
    this.up = this.east;
    this.east = this.down;
    this.down = this.west;
    this.west = up;
  }

  rotateEast() {
    const up = this.up;
    this.up = this.west;
    this.west = this.down;
    this.down = this.east;
    this.east = up;
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

const cubeView = {
  up: new Face(loc)
};

// Find all connected sides starting from the top, keep looping until we have all 6 sides

// Grab all the nodes in a particular size, flipping if needed to arrange side
// const buildCube = face => {
//   if (face.done) {
//     return;
//   }

//   // Connect below face to left/right faces
//   if (face.down) {
//     if (face.right && !face.down.right) {
//       face.down.connectToFace('right', face.right, 'down');
//     }
//     if (face.left && !face.down.left) {
//       face.down.connectToFace('left', face.left, 'down');
//     }
//   }
//   // Connect above face to left/right faces
//   if (face.up) {
//     if (face.right && !face.up.right) {
//       face.up.connectToFace('right', face.right, 'up');
//     }
//     if (face.left && !face.up.left) {
//       face.up.connectToFace('left', face.left, 'up');
//     }
//   }
//   // Connect opposite face to the left to above/below faces
//   if (face.left?.left) {
//     if (!face.left?.up && face.up && !face.left.left.up) {
//       face.left.left.connectToFace('up', face.up, 'up');
//     }
//     if (!face.left?.down && face.down && !face.left.left.down) {
//       face.left.left.connectToFace('down', face.down, 'down');
//     }
//   }
//   // Connect opposite face to the right to above/below faces
//   if (face.right?.right) {
//     if (!face.right?.up && face.up && !face.right.right.up) {
//       face.right.right.connectToFace('up', face.up, 'up');
//     }
//     if (!face.right?.down && face.down && !face.right.right.down) {
//       face.right.right.connectToFace('down', face.down, 'down');
//     }
//   }
//   // Connect opposite face above to left/right faces
//   if (face.up?.up) {
//     if (!face.up?.left && face.left && !face.up.up.left) {
//       face.up.up.connectToFace('left', face.left, 'left');
//     }
//     if (!face.up?.right && face.right && !face.up.up.right) {
//       face.up.up.connectToFace('right', face.right, 'right');
//     }
//   }
//   // Connect opposite face below to left/right faces
//   if (face.down?.down) {
//     if (!face.down?.left && face.left && !face.down.down.left) {
//       face.down.down.connectToFace('left', face.left, 'left');
//     }
//     if (!face.down?.right && face.right && !face.down.down.right) {
//       face.down.down.connectToFace('right', face.right, 'right');
//     }
//   }

//   face.done = true;

//   // Skip up since we started at the top
//   face.right && buildCube(face.right);
//   face.down && buildCube(face.down);
//   face.left && buildCube(face.left);
// };

// Build the cube off the starting location
// buildCube(new Face(loc));

// 1 for right, -1 for left
const turn = d => (dir + d > 3 ? 0 : dir + d < 0 ? 3 : dir + d);

// Start walking
path.forEach(a => {
  // Turn
  if (['L', 'R'].includes(a)) {
    dir = turn(a === 'L' ? -1 : 1);
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

// Answer: 144244
