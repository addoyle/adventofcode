const common = require('../../common');

const input = common.lines('input');

const sep = ' -> ';
const pairs = input.map(line => line.split(sep).map(pair => pair.split(',').map(p => +p)));

const coveredPoints = {};
pairs.forEach(pair => {
  const [x1, y1, x2, y2] = [...pair[0], ...pair[1]];

  // Handle lines
  if (x1 === x2 || y1 === y2) {
    for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
      for (let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
        coveredPoints[`${i},${j}`] = (coveredPoints[`${i},${j}`] || 0) + 1;
      }
    }
  }
  // Diagonals
  else {
    for (let i = 0; i <= Math.max(x1, x2) - Math.min(x1, x2); i++) {
      const key = `${Math.min(x1, x2) + i},${x1 < x2 ? y1 + (y1 < y2 ? i : -i) : y2 + (y1 > y2 ? i : -i)}`;
      coveredPoints[key] = (coveredPoints[key] || 0) + 1;
    }
  }
});

console.log(Object.values(coveredPoints).filter(n => n > 1).length);

// Correct answer: 20299
