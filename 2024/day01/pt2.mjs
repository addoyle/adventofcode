import { lines } from '../../common.mjs';

const [left, right] = lines('./input.txt')
  .map(line => line.split('   ').map(n => parseInt(n)))
  .reduce(
    (arrs, [a, b]) => {
      arrs[0].push(a);
      arrs[1][b] ??= 0;
      arrs[1][b]++;
      return arrs;
    },
    [[], {}]
  );

console.log(left.reduce((sum, n) => sum + n * (right[n] ?? 0), 0));
