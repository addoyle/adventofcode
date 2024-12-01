import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line => line.split('   ').map(n => parseInt(n)))
    .reduce(
      (arrs, [a, b]) => {
        arrs[0].push(a);
        arrs[1].push(b);
        return arrs;
      },
      [[], []]
    )
    .map(a => a.toSorted())
    .reduce((arrs, arr) => {
      arr.forEach((item, i) => {
        arrs[i] ??= [];
        arrs[i].push(item);
      });
      return arrs;
    }, [])
    .map(([a, b]) => Math.abs(a - b))
    .reduce((sum, diff) => sum + diff, 0)
);
