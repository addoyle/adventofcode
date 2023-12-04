import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line =>
      ((winning, mine) => (set => mine.filter(n => set.has(n)).length)(new Set(winning)))(
        ...line
          .split(':')[1]
          .trim()
          .split('|')
          .map(nums =>
            nums
              .trim()
              .split(/\s+/)
              .map(n => parseInt(n))
          )
      )
    )
    .filter(Boolean)
    .map(n => 2 ** (n - 1))
    .reduce((sum, n) => sum + n, 0)
);
