import { lines } from '../common.mjs';

const a = 'a'.charCodeAt(0);
const A = 'A'.charCodeAt(0);
const priority = character =>
  (c => (c >= a ? c - a : c - A + 26))(character.charCodeAt(0)) + 1;

console.log(
  (rows =>
    [...Array(Math.ceil(rows.length / 3))].map(_ =>
      rows.splice(0, 3).map(row => row.split(''))
    ))(lines('./input.txt'))
    .map(pouches =>
      [
        ...new Set(
          pouches[0]
            .filter(item => pouches[1].includes(item))
            .filter(item => pouches[2].includes(item))
        )
      ].map(priority)
    )
    .flat()
    .reduce((sum, p) => sum + p, 0)
);

// Answer: 2548
