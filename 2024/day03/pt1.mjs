import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .join('')
    .match(/((?<=mul\()\d+,\d+(?=\)))/g)
    .map(mul =>
      mul
        .split(',')
        .map(n => parseInt(n))
        .reduce((prod, n) => prod * n, 1)
    )
    .reduce((sum, n) => sum + n, 0)
);
