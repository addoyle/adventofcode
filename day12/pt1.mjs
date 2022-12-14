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
    // console.log({ dx, dy });
    if (
      grid[dy] !== undefined &&
      grid[dy][dx] !== undefined &&
      [0, 1].includes(grid[dy][dx] - grid[y][x]) //&&
      // !seen.has(`${dx},${dy}`)
    ) {
      nbs.push([dx, dy]);
      // seen.add(`${dx},${dy}`);
    }
  });
  // console.log(nbs);
  return nbs;
};

const seen = new Set([`${start[0]},${start[1]}`]);
let cur = [start];
let next = [];
let steps;
for (steps = 0; cur.length; steps++) {
  cur
    .map(nextSteps)
    .flat()
    .forEach(([x, y]) => {
      // const [x, y] = p;
      // console.log({ x, y });
      if (!seen.has(`${x},${y}`)) {
        next.push([x, y]);
      }
      seen.add(`${x},${y}`);
    });

  // console.log({ next, seen });

  cur = next;
  next = [];

  // cur = cur.map(p => nextSteps(p, seen)).flat();
  // console.log(cur);
}

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

// Start the climb!
console.log(steps);
