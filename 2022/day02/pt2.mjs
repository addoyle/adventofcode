import { lines } from '../common.mjs';

const toInt = letter => {
  const c = letter.charCodeAt(0);
  const a = 'A'.charCodeAt(0);
  const x = 'X'.charCodeAt(0);
  return c >= x ? c - x : c - a;
};

const scoreOutcome = (a, b) => {
  let outcome = b - 1 + a;
  outcome = outcome > 2 ? 0 : outcome < 0 ? 2 : outcome;

  // Score of the win
  return b * 3 + (outcome + 1);
};

console.log(
  lines('input.txt')
    .map(row => row.split(' ').map(i => toInt(i)))
    .reduce((sum, round) => sum + scoreOutcome(round[0], round[1]), 0)
);

// Answer: 10349
