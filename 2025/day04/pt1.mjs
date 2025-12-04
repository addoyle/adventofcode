import { lines } from '../../common.mjs';

const grid = lines('./input.txt').map(row => row.split(''));

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

console.log(
  grid
    .map((row, y) => row.reduce((sum, col, x) => sum + (col === '@' && canRemove(y, x) ? 1 : 0), 0))
    .reduce((sum, n) => sum + n, 0)
);
