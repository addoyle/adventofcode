import { lines } from '../../common.mjs';

let grid = lines('./input.txt').map(row => row.split(''));

const canRemove = (row, col) =>
  [
    grid[row - 1]?.[col - 1],
    grid[row - 1]?.[col],
    grid[row - 1]?.[col + 1],
    grid[row]?.[col - 1],
    grid[row]?.[col + 1],
    grid[row + 1]?.[col - 1],
    grid[row + 1]?.[col],
    grid[row + 1]?.[col + 1]
  ].filter(v => v === '@').length < 4;

let totalRemoved = 0;
let removed = 0;
do {
  removed = 0;
  const gen = [];
  grid.forEach((row, y) => {
    gen.push([...grid[y]]);
    row.forEach((col, x) => {
      // Empty, abort
      if (col === '.') {
        return;
      }

      if (canRemove(y, x)) {
        gen[y][x] = '.';
        removed++;
      }
    });
  });

  totalRemoved += removed;
  grid = gen;
} while (removed > 0);

console.log(totalRemoved);
