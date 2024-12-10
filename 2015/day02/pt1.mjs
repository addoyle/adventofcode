import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line => line.split('x').map(n => parseInt(n)))
    .map(d => d.map((n, i) => d.slice(i + 1).map(m => n * m)).flat())
    .map(d => Math.min(...d) + 2 * d.reduce((sum, n) => sum + n, 0))
    .reduce((sum, n) => sum + n)
);
