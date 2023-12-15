import { lines } from '../../common.mjs';
import { createHash } from 'crypto';

const rocks = lines('./input.txt').map(line => [...line]);

const hash = rocks => createHash('sha1').update(rocks.toString()).digest('hex');

const transpose = a => a[0].map((_, i) => a.map(r => r[i]));

// Rocks fall from right to left
const fall = rocks => {
  const fallenRocks = [...rocks];

  fallenRocks.forEach((row, y) => {
    let i = 0;
    row.forEach((rock, x) => {
      if (rock === 'O') {
        row[x] = '.';
        row[i++] = 'O';
      }
      if (rock === '#') {
        i = x + 1;
      }
    });
  });

  return fallenRocks;
};

const getLoad = rocks => {
  let load = 0;

  transpose(rocks).forEach(row => {
    row.forEach((rock, i) => {
      let blocked = false;
      if (rock === 'O') {
        if (!blocked) {
          load += row.length - i;
        }
      }
      if (rock === '#') {
        blocked = true;
      }
    });
  });

  return load;
};

const fallNorth = rocks => transpose(fall(transpose(rocks)));
const fallEast = rocks => fall(rocks.map(row => row.toReversed())).map(row => row.toReversed());
const fallSouth = rocks => transpose(fall(transpose(rocks.toReversed()))).toReversed();
const fallWest = rocks => fall(rocks);

const cache = {};
const numCycles = 1000000000;
let cycle = rocks;
let i = 0;
let firstCacheHit;
let firstCacheHitKey;
for (; i < numCycles; i++) {
  const key = hash(cycle);
  if (cache[key]) {
    if (firstCacheHitKey === key) {
      break;
    }

    if (!firstCacheHitKey) {
      firstCacheHitKey = key;
      firstCacheHit = i;
    }
  }

  cycle = cache[key] = fallEast(fallSouth(fallWest(fallNorth(cycle))));
}

// Since the previous method SHOULD break before hitting a billion, run a few more times
// to make sure it matches what would happen if it did land on the 1 billionth cycle
for (let left = 0; left < (numCycles - firstCacheHit) % (i - firstCacheHit); left++) {
  cycle = cache[hash(cycle)];
}

console.log(getLoad(cycle));
