import { lines } from '../../common.mjs';

let id = 0;
console.log(
  lines('./input.txt')[0]
    .split('')
    .map(n => parseInt(n))
    .reduce((blocks, indicator, i) => {
      if (i % 2) {
        blocks.push(...Array(indicator));
      } else {
        blocks.push(...Array(indicator).fill(id++));
      }
      return blocks;
    }, [])
    .reduce((compacted, _, i, blocks) => {
      compacted ??= blocks;
      if (i >= compacted.length) {
        return compacted;
      }

      while (compacted[i] === undefined && i < compacted.length - 1) {
        compacted[i] ??= compacted.pop();
      }
      return compacted;
    }, null)
    .reduce((checksum, n, i) => (checksum += (n ?? 0) * i))
);
