import { lines } from '../../common.mjs';

const grid = lines('./input.txt').map(row => row.split(''));
const gears = {};
const findParts = (row, col = 0, n = '', adjacentGears = new Set()) => {
  const c = grid[row][col];

  if (c && !isNaN(c)) {
    n += c;

    // Add all adjacent gears
    adjacentGears = new Set([
      ...adjacentGears,
      ...[
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1]
      ]
        .filter(g => grid[g[0]] && grid[g[0]][g[1]] === '*')
        .map(g => g.toString())
    ]);
  } else {
    [...adjacentGears].forEach(part => (gears[part] = [...(gears[part] || []), parseInt(n)]));
    adjacentGears = new Set();
    n = '';
  }

  col < grid[row].length && findParts(row, col + 1, n, adjacentGears);
};

grid.forEach((_, i) => findParts(i));
console.log(
  Object.values(gears)
    .filter(gear => gear.length === 2)
    .map(gear => gear[0] * gear[1])
    .reduce((sum, n) => sum + n, 0)
);
