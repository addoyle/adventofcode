import { lines } from '../../common.mjs';

const [towels, patterns] = (([t, _, ...p]) => [new Set(t.split(', ')), p])(lines('./input.txt'));
const longest = [...towels].reduce((l, t) => Math.max(l, t.length), -Infinity);

const possible = (pattern, pos = 0) => {
  if (pos >= pattern.length) {
    return true;
  }

  let isPossible = false;
  for (let i = longest; i > 0; i--) {
    if (towels.has(pattern.substring(pos, pos + i)) && possible(pattern, pos + i)) {
      isPossible = true;
      break;
    }
  }
  return isPossible;
};

console.log(patterns.reduce((total, pattern) => total + possible(pattern), 0));
