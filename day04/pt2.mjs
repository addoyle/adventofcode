import { lines } from '../common.mjs';

const overlaps = (a, b) => a[1] >= b[0] && a[0] <= b[1];

console.log(
  lines('./input.txt')
    .map(line =>
      line.split(',').map(sections => sections.split('-').map(r => parseInt(r)))
    )
    .filter(pair => overlaps(pair[0], pair[1])).length
);

// Answer: 888
