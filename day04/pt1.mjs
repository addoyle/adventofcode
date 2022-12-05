import { lines } from '../common.mjs';

const contains = (a, b) => a[0] <= b[0] && a[1] >= b[1];

console.log(
  lines('./input.txt')
    .map(line =>
      line.split(',').map(sections => sections.split('-').map(r => parseInt(r)))
    )
    .filter(pair => contains(pair[0], pair[1]) || contains(pair[1], pair[0]))
    .length
);

// Answer: 471
