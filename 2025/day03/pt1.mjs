import { lines } from '../../common.mjs';

console.log(lines('./sample.txt')
  .map(line => line.split('').map(n => parseInt(n)))
);
