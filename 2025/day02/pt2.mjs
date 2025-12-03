import { lines } from '../../common.mjs';

const invalidIds = new Set();

const chunk = (arr, n) => [...arr].map((_, i) => i % n === 0 ? arr.slice(i, i + n) : null).filter(Boolean);

lines('./input.txt')[0]
  .split(',')
  .map(pair => pair.split('-'))
  .forEach(([low, hi]) => {
    const [min, max] = [low, hi].map(n => parseInt(n));
    for (let n = min; n <= max; n++) {
      const seq = `${n}`;

      for (let m = 1; m <= Math.floor(seq.length / 2); m++) {
        // Not divisible by m
        if (seq.length % m !== 0) {
          continue;
        }

        // If all chunks are equal, invalid id
        if (new Set(chunk(seq, m)).size === 1) {
          invalidIds.add(seq);
        }
      }
    }
  });

console.log(invalidIds.values().reduce((sum, id) => sum + parseInt(id), 0));