import { lines } from '../../common.mjs';

const grid = lines('./input.txt').map(row => row.split(''));
const parts = [];
const findParts = (row, col = 0, n = '', valid = false) => {
  const c = grid[row][col];

  if (c && !isNaN(c)) {
    n += c;

    if (!valid) {
      // Check if it's adjacent to a symbol

      valid = [
        ...(grid[row - 1] ? [grid[row - 1][col - 1], grid[row - 1][col], grid[row - 1][col + 1]] : []),
        grid[row][col - 1],
        grid[row][col + 1],
        ...(grid[row + 1] ? [grid[row + 1][col - 1], grid[row + 1][col], grid[row + 1][col + 1]] : [])
      ]
        .filter(Boolean)
        .some(c => isNaN(c) && c !== '.');
    }
  } else {
    if (valid) {
      parts.push(parseInt(n));
    }
    valid = false;
    n = '';
  }

  col < grid[row].length && findParts(row, col + 1, n, valid);
};

grid.forEach((_, i) => findParts(i));
console.log(parts.reduce((sum, n) => sum + n, 0));
