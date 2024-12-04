import { intLines } from '../../common.mjs';

const input = intLines('input');
let p = input[0];
let numIncreases = 0;

input.forEach((v, i) => {
  numIncreases += i > 0 && v > p ? 1 : 0;
  p = v;
});

console.log(numIncreases);

// Correct answer: 1688
