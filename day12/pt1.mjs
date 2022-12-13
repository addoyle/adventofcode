import { lines } from '../common.mjs';

const START = -1;
const END = 26;
const a = 'a'.charCodeAt(0);
const S = 'S'.charCodeAt(0);
const E = 'E'.charCodeAt(0);

const grid = lines('./sample.txt').map(line =>
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
console.log({ start, end });

const validSteps = ([x, y], seen) => {
  const nbs = [];
  [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ].forEach(([dx, dy]) => {
    console.log({ dx, dy });
    if (
      grid[dy] !== undefined &&
      grid[dy][dx] !== undefined &&
      [0, 1].includes(grid[dy][dx] - grid[y][x]) &&
      !seen.has(`${dx},${dy}`)
    ) {
      nbs.push([dx, dy]);
    }
  });
  return nbs;
};

const climb = () => {
  const seen = new Set([`${start[0]},${start[1]}`]);
  let steps = 0;
  let cur = [start];
  let next = [];
  // while (cur.length) {}
  // console.log(validSteps(cur[0], seen));
};

// Start the climb!
climb();

// const shortPaths = paths.filter(p => p.length === shortestPath);

const drawPath = path => {
  const g = grid.map(r => r.map(_ => ' '));
  let [x, y] = startPoint;
  path.forEach(p => {
    g[y][x] = p;
    p === '^' && y--;
    p === 'v' && y++;
    p === '<' && x--;
    p === '>' && x++;
  });
  g[y][x] = 'E';
  console.log(g.map(r => r.join('')).join('\n'));
};

// Draw path
// shortPaths.forEach(drawPath);

// console.log({ shortestPath });
