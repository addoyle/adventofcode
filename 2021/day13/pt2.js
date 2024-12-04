const common = require('../../common.js');

const lines = common.lines('input');
const dots = lines.filter(l => l.match(/^\d+,\d+$/g)).map(l => l.split(',').map(Number));
const folds = lines
  .filter(l => l.startsWith('fold along '))
  .map(l => l.split('='))
  .map(([k, line]) => [k.slice(-1), +line]);

// Sort dots by y, then by x, then build dot matrix
const dotMatrix = dots
  .sort((a, b) => (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]))
  .reduce((matrix, dot) => {
    if (!matrix[dot[1]]) {
      matrix[dot[1]] = new Set();
    }
    matrix[dot[1]].add(dot[0]);
    return matrix;
  }, {});

const doFold = {
  x: (matrix, fold) =>
    Object.keys(matrix).reduce(
      (obj, k) => ({
        ...obj,
        [k]: new Set([...matrix[k]].map(v => (v < fold ? v : 2 * fold - v)))
      }),
      {}
    ),
  y: (matrix, fold) =>
    Object.keys(matrix)
      .map(Number)
      .reduce((obj, k) => {
        const key = k < fold ? k : 2 * fold - k;
        return {
          ...obj,
          [key]: obj[key] ? new Set([...obj[key], ...matrix[k]]) : matrix[k]
        };
      }, {})
};

const print = d => {
  const [maxX, maxY] = [
    Object.values(d).reduce((max, row) => Math.max(max, ...[...row]), 0),
    Math.max(...Object.keys(d).map(Number))
  ];

  for (let i = 0; i <= maxY; i++) {
    if (!d[i]) {
      console.log(' '.repeat(maxX));
    } else {
      let dotRow = '';
      const row = [...d[i]].sort((a, b) => a - b);
      for (let j = 0; j <= maxX; j++) {
        dotRow += row[0] === j ? row.shift() !== undefined && '#' : ' ';
      }
      console.log(dotRow);
    }
  }
};

print(folds.reduce((matrix, fold) => doFold[fold[0]](matrix, fold[1]), dotMatrix));

// Correct answer: FGKCKBZG
