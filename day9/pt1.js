const common = require('../common.js');

const grid = common.lines('input').map(l => l.split('').map(Number));
const lowPoints = [];

const isLowPoint = (row, col) =>
  (row === 0 || grid[row][col] < grid[row - 1][col]) &&
  (row + 1 >= grid.length || grid[row][col] < grid[row + 1][col]) &&
  (col === 0 || grid[row][col] < grid[row][col - 1]) &&
  (col + 1 >= grid[0].length || grid[row][col] < grid[row][col + 1]);

grid.forEach((row, i) =>
  row.forEach((col, j) => {
    if (isLowPoint(i, j)) {
      lowPoints.push([i, j]);
    }
  })
);

console.log(
  lowPoints.reduce((sum, point) => sum + grid[point[0]][point[1]] + 1, 0)
);

// Correct answer: 444
