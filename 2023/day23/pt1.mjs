import { lines } from '../../common.mjs';

const island = lines('./input.txt').map(row => row.split(''));
const start = [0, island[0].indexOf('.')];
let max = 0;

const walk = (pos = start, been = new Set()) => {
  // Been there before or out of bounds
  if (been.has(pos.toString()) || pos[0] < 0 || pos[0] >= island.length) {
    return;
  }

  const feature = island[pos[0]][pos[1]];

  // Hit a tree
  if (feature === '#') {
    return;
  }

  // New been with current position
  been = new Set([...been, pos.toString()]);

  // At the end!
  if (pos[0] === island.length - 1) {
    max = Math.max(max, been.size - 1);
    return;
  }

  if (feature === '>') {
    walk([pos[0], pos[1] + 1], been);
  } else if (feature === 'v') {
    walk([pos[0] + 1, pos[1]], been);
  } else {
    walk([pos[0] - 1, pos[1]], been);
    walk([pos[0] + 1, pos[1]], been);
    walk([pos[0], pos[1] - 1], been);
    walk([pos[0], pos[1] + 1], been);
  }
};

walk();

console.log(max);
