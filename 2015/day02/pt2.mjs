import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line =>
      line
        .split('x')
        .map(n => parseInt(n))
        .toSorted((a, b) => a - b)
    )
    .map(d => 2 * d.slice(0, -1).reduce((sum, n) => sum + n, 0) + d.reduce((prod, n) => prod * n, 1))
    .reduce((sum, n) => sum + n)
);
