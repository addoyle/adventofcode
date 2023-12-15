import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')[0]
    .split(',')
    .map(row => [...row].reduce((sum, n) => ((sum + n.charCodeAt(0)) * 17) % 256, 0))
    .reduce((sum, n) => sum + n, 0)
);
