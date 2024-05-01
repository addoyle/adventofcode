import { lines } from '../../common.mjs';

const grid = lines('./input.txt').map(line => line.split(''));

const start = [];
grid.find((r, y) =>
  (x => {
    if (x >= 0) {
      start[0] = y;
      start[1] = x;
    }
    return x >= 0;
  })(r.indexOf('S'))
);

const deset = s => [...s].map(p => p.split(',').map(n => parseInt(n)));
const set = s => new Set(s.map(p => p.join(',')));

const findPlots = plots =>
  [
    [plots[0] - 1, plots[1]],
    [plots[0] + 1, plots[1]],
    [plots[0], plots[1] - 1],
    [plots[0], plots[1] + 1]
  ].filter(p => (t => t && '.S'.includes(t))((grid[p[0]] || [])[p[1]]));

let gen = set([start]);
for (let i = 0; i < 64; i++) {
  gen = set(deset(gen).map(findPlots).flat());
}
console.log(gen.size);
