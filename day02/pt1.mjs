import { lines } from '../common.mjs';

const toInt = letter => {
  const c = letter.charCodeAt(0);
  const a = 'A'.charCodeAt(0);
  const x = 'X'.charCodeAt(0);
  return c >= x ? c - x : c - a;
};

const score = (a, b) =>
  // Score of the win
  ((Math.abs(b - a) > 1 ? -(b - a) / 2 : b - a) + 1) * 3 +
  // Score of the choice (1 - rock, 2 - paper, 3 - scissors)
  (b + 1);

console.log(
  lines('input.txt')
    .map(row => row.split(' ').map(i => toInt(i)))
    .reduce((sum, round) => sum + score(round[0], round[1]), 0)
);

// Answer: 11063
