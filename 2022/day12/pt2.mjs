import { lines } from '../common.mjs';

const START = -1;
const END = 26;
const a = 'a'.charCodeAt(0);
const S = 'S'.charCodeAt(0);
const E = 'E'.charCodeAt(0);

const grid = lines('./input.txt').map(line =>
  line
    .split('')
    .map(c => c.charCodeAt(0) - a)
    .map(c => (c === S - a ? START : c === E - a ? END : c))
);

let start, end;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === START) {
      start = [x, y];
    }
    if (grid[y][x] === END) {
      end = [x, y];
    }
  }
}

const nextSteps = ([x, y]) => {
  const nbs = [];
  [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ].forEach(([dx, dy]) => {
    if (
      grid[dy] &&
      grid[dy][dx] !== undefined &&
      grid[dy][dx] - grid[y][x] >= -1
    ) {
      nbs.push([dx, dy]);
    }
  });
  return nbs;
};

const seen = new Set([`${start[0]},${start[1]}`]);
let cur = [end];
let next = [];
let steps;
for (steps = 0; cur.length; steps++) {
  cur
    .map(nextSteps)
    .flat()
    .forEach(([x, y]) => {
      const key = `${x},${y}`;

      if (grid[y][x] === 0) {
        console.log(steps - 1);
        process.exit(0);
      }

      if (!seen.has(key)) {
        next.push([x, y]);
        seen.add(key);
      }
    });

  cur = next;
  next = [];
}

console.log(' -- BEFORE -- ');
console.log(
  grid.map(r => r.map(c => String.fromCharCode(c + a)).join('')).join('\n')
);
console.log(' -- AFTER -- ');
console.log(
  (g => {
    [...seen]
      .map(p => p.split(',').map(n => parseInt(n)))
      .forEach(([x, y]) => (g[y][x] = '#'));
    return g;
  })(grid.map(r => r.map(c => String.fromCharCode(c + a))))
    .map(r => r.join(''))
    .join('\n')
);

// Don't include the last step
console.log(steps);
