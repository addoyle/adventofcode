import { lines } from '../../common.mjs';

console.log(
  (m => m[0].map((_, i) => m.map(row => row[i])))(lines('./input.txt').map(line => line.split(/ +/g).filter(Boolean)))
    .map(p =>
      p
        .slice(0, -1)
        .map(n => parseInt(n))
        .reduce((acc, n) => (p.at(-1) === '+' ? acc + n : acc * n), p.at(-1) === '+' ? 0 : 1)
    )
    .reduce((sum, n) => sum + n, 0)
);
