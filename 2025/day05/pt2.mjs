import { lines } from '../../common.mjs';

const ranges = (rows => rows.slice(0, rows.indexOf('')).map(range => range.split('-').map(n => parseInt(n))))(
  lines('./input.txt')
).toSorted(([a], [b]) => a - b);

const combinedRanges = [];
let cur = [...ranges[0]];
for (let i = 1; i < ranges.length; i++) {
  const range = ranges[i];
  if (cur[1] + 1 >= range[0]) {
    cur[1] = Math.max(range[1], cur[1]);
  } else {
    combinedRanges.push(cur);
    cur = [...range];
  }
}
combinedRanges.push(cur);

console.log(combinedRanges.reduce((sum, range) => sum + (range[1] - range[0]) + 1, 0));
