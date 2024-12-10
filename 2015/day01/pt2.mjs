import { intLines } from '../../common.mjs';

const input = intLines('input');
let p;
let numIncreases = 0;

input.forEach((v, i) => {
  if (i < 2) return;

  const window = v + input[i - 1] + input[i - 2];
  numIncreases += window > p ? 1 : 0;
  p = window;
});

console.log(numIncreases);

// Correct answer: 1728
