import { lines } from '../common.mjs';

const rocks = [
  [[2, 2, 2, 2]],
  [
    [0, 2, 0],
    [2, 2, 2],
    [0, 2, 0]
  ],
  [[2], [2], [2, 2, 2]],
  [[2], [2], [2], [2]],
  [
    [2, 2],
    [2, 2]
  ]
];

// Initial values
const tunnel = [];
let rock;

const nextRock = () => {
  rock = rocks.shift();
  rocks.push(rock);
  tunnel.unshift(
    ...[...Array(3 + rock.length)].map(_ => [...Array(7)].map(_ => 0))
  );
  rock.forEach((r, i) => r.forEach((c, j) => (tunnel[i][j + 2] = c)));
};

// Set things up with the first rock
nextRock();

lines('./sample.txt')[0]
  .split('')
  .map(w => (w === '<' ? -1 : w === '>' ? 1 : 0))
  .forEach(w => {
    // Wind blows rock

    // Print tunnel
    // console.log(tunnel);
    console.log(
      [...tunnel].map(r => r.map(c => ['.', '#', '@'][c]).join('')).join('\n') +
        '\n+-----+'
    );
  });
