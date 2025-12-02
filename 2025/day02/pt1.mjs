import { lines } from '../../common.mjs';

const invalidIds = new Set();

lines('./input.txt')[0]
  .split(',')
  .map(pair => pair.split('-'))
  .forEach(([low, hi]) => {
    const [min, max] = [low, hi].map(n => parseInt(n));
    for (let n = min; n <= max; n++) {
      const seq = `${n}`;

      // Odd length, can't have a double sequence
      if (seq.length % 2 !== 0) {
        continue;
      }

      const [left, right] = [
        seq.slice(0, seq.length / 2),
        seq.slice(seq.length / 2)
      ];

      if (left === right) {
        invalidIds.add(n);
      }
    }
  });

console.log(invalidIds.values().reduce((sum, id) => sum + parseInt(id), 0));