import { lines } from '../../common.mjs';

const quad = (a, b, c) => {
  const quot = 2 * a;
  const left = -b / quot;
  const right = Math.sqrt(b * b - 4 * a * c) / quot;

  return [Math.floor(left + right) + 1, Math.ceil(left - right) - 1];
};

console.log(
  (arr => arr[0].map((_, i) => arr.map(row => row[i])))(
    lines('./input.txt').map(line => line.match(/\d+/g).map(n => parseInt(n)))
  )
    .map(race => quad(-1, race[0], -race[1]))
    .map(race => race[1] - race[0] + 1)
    .reduce((prod, n) => prod * n, 1)
);
