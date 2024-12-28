import { lines } from '../../common.mjs';

const [towels, patterns] = (([t, _, ...p]) => [t.split(', '), p])(lines('./input.txt'));
const longest = [...towels].reduce((l, t) => Math.max(l, t.length), -Infinity);

const memo = new Map();

const possible = pattern => {
  if (memo.has(pattern)) {
    return memo.get(pattern);
  }

  if (!pattern.length) {
    return 1;
  }

  const total = towels
    .filter(t => pattern.startsWith(t))
    .reduce((sum, towel) => sum + possible(pattern.slice(towel.length)), 0);
  memo.set(pattern, total);
  return total;
};

// console.log(possible(patterns[0]));
console.log(patterns.reduce((total, pattern) => total + possible(pattern), 0));
