import { readFileSync } from 'fs';

const n = 14;

console.log(
  (stream => {
    const arr = stream.split('');
    for (let i = 0; i < arr.length - n; i++) {
      if (new Set(arr.slice(i, i + n)).size === n) {
        return i + n;
      }
    }
    return -1;
  })(readFileSync('./input.txt', 'utf8'))
);

// Answer: 2145
