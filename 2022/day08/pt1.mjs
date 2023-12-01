import { lines } from '../common.mjs';

const grid = lines('./input.txt').map(r => r.split('').map(v => parseInt(v)));

// Set to border count
const numVisible = new Set();

// Get vertically visible trees
for (let i = 0; i < grid[0].length; i++) {
  let topCur = -1;
  let bottomCur = -1;
  for (
    let ty = 0, by = grid.length - 1;
    ty < grid.length && by >= 0;
    ty++, by--
  ) {
    if (grid[ty][i] > topCur) {
      topCur = grid[ty][i];
      numVisible.add([i, ty].toString());
    }
    if (grid[by][i] > bottomCur) {
      bottomCur = grid[by][i];
      numVisible.add([i, by].toString());
    }
  }
}

// Get horizontally visible trees
for (let i = 0; i < grid.length; i++) {
  let leftCur = -1;
  let rightCur = -1;
  for (
    let lx = 0, rx = grid[i].length - 1;
    lx < grid[i].length && rx >= 0;
    lx++, rx--
  ) {
    if (grid[i][lx] > leftCur) {
      leftCur = grid[i][lx];
      numVisible.add([lx, i].toString());
    }
    if (grid[i][rx] > rightCur) {
      rightCur = grid[i][rx];
      numVisible.add([rx, i].toString());
    }
  }
}

console.log(numVisible.size);

// Answer: 1647
