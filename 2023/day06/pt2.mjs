import { lines } from '../../common.mjs';

const quad = (a, b, c) => {
  const quot = 2 * a;
  const left = -b / quot;
  const right = Math.sqrt(b * b - 4 * a * c) / quot;

  return [Math.floor(left + right) + 1, Math.ceil(left - right) - 1];
};

const race = lines('./input.txt').map(line => parseInt(line.match(/\d+/g).join('')));
const wins = quad(-1, race[0], -race[1]);

console.log(wins[1] - wins[0] + 1);
