import { lines } from '../common.mjs';

const a = 'a'.charCodeAt(0);
const A = 'A'.charCodeAt(0);
const priority = character =>
  (c => (c >= a ? c - a : c - A + 26))(character.charCodeAt(0)) + 1;

console.log(
  lines('./input.txt')
    .map(line =>
      (items => [
        items.slice(0, items.length / 2),
        items.slice(items.length / 2)
      ])(line.split(''))
    )
    .map(pouches =>
      [...new Set(pouches[0].filter(item => pouches[1].includes(item)))].map(
        priority
      )
    )
    .flat()
    .reduce((sum, p) => sum + p, 0)
);

// Answer: 7903
