import { lines } from '../../common.mjs';

let sum = 0;
for (const [i, c] of Object.entries(lines('./input.txt')[0].split(''))) {
  sum += (c === '(') - (c === ')');
  if (sum < 0) {
    console.log(parseInt(i) + 1);
    break;
  }
}
