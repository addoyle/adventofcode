import { lines } from '../../common.mjs';

const inputLines = lines('input');
const dots = inputLines.filter(l => l.match(/^\d+,\d+$/g)).map(l => l.split(',').map(Number));
const folds = inputLines
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

console.log(Object.values(doFold[folds[0][0]](dotMatrix, folds[0][1])).reduce((sum, row) => (sum += row.size), 0));

// Correct answer: 687
