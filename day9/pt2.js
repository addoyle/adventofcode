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

const getBasinSize = (pt, basin = new Set()) => {
  if (
    pt[0] < 0 || pt[0] >= grid.length || 
    pt[1] < 0 || pt[1] >= grid[0].length || 
    basin.has(pt.join(',')) || 
    grid[pt[0]][pt[1]] === 9
  ) {
    return;
  }

  // Add point to basin
  basin.add(pt.join(','));

  getBasinSize([pt[0] - 1, pt[1]], basin); // up
  getBasinSize([pt[0] + 1, pt[1]], basin); // down
  getBasinSize([pt[0], pt[1] - 1], basin); // left
  getBasinSize([pt[0], pt[1] + 1], basin); // right

  return [...basin];
}

console.log(
  lowPoints.map(pt => getBasinSize(pt).length).sort((a, b) => b - a).slice(0, 3).reduce((prod, n) => prod * n, 1)
);

// Correct answer: 1168440