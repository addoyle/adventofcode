import { lines } from '../common.mjs';

const grid = lines('./input.txt').map(r => r.split('').map(v => parseInt(v)));
const scenicScore = (xpos, ypos) => {
  const tree = grid[ypos][xpos];
  const ylen = grid.length;
  const xlen = grid[0].length;

  // Get up score
  let up = 0;
  for (let y = ypos - 1; y >= 0 && ++up && grid[y][xpos] < tree; y--);

  // Get down score
  let down = 0;
  for (let y = ypos + 1; y < ylen && ++down && grid[y][xpos] < tree; y++);

  // Get left score
  let left = 0;
  for (let x = xpos - 1; x >= 0 && ++left && grid[ypos][x] < tree; x--);

  // Get right score
  let right = 0;
  for (let x = xpos + 1; x < xlen && ++right && grid[ypos][x] < tree; x++);

  return up * down * left * right;
};

console.log(
  Math.max(
    ...grid.map((row, y) => row.map((_tree, x) => scenicScore(x, y))).flat()
  )
);

// Answer: 392080
