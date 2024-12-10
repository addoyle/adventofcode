import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')[0]
    .split('')
    .reduce((sum, c) => (sum += (c === '(') - (c === ')')), 0)
);
