import { lines } from '../../common.mjs';

const digplan = lines('./input.txt')
  .map(line => line.split(' '))
  .map(([dir, len, color]) => ({ dir: 'LURD'.indexOf(dir), len: parseInt(len), color: color.slice(1, -1) }));

const lagoon = [['#']];

let x = 0;
let y = 0;
for (let p in digplan) {
  const { dir, len, color } = digplan[p];
  for (let i = 0; i < len; i++) {
    y += dir % 2 ? dir - 2 : 0;
    x += !(dir % 2) ? dir - 1 : 0;
    if (!lagoon[y]) {
      lagoon[y] = [];
    }
    lagoon[y][x] = '#';
  }
}

const iter = (arr, func) =>
  Object.keys(arr)
    .map(n => parseInt(n))
    .toSorted()
    .map(i => arr[i]);

const iterLagoon = iter(lagoon);

const iRange = arr => {
  const is = Object.keys(arr).map(n => parseInt(n));
  return [Math.min(...is), Math.max(...is)];
};

const yRange = iRange(lagoon);
const xRange = iterLagoon.reduce(
  (total, range) => [Math.min(total[0], range[0]), Math.max(total[1], range[1])],
  [Infinity, -Infinity]
);

console.log(
  iter(lagoon)
    .map(row => {
      const r = iRange(row);
      return (
        '.'.repeat(r[0] - xRange[0]) +
        iter([...row])
          .map(n => n || '.')
          .join('') +
        '.'.repeat(xRange[1] - r[1])
      );
    })
    .join('\n')
);

let oob = false;
const fillLagoon = (y, x) => {
  if (oob || lagoon[y][x] === '#') {
    return;
  }

  if (y < yRange[0] || y > yRange[1] || x < xRange[0] || x > xRange[1]) {
    oob = true;
    return;
  }

  lagoon[y][x] = '#';

  fillLagoon(y - 1, x);
  fillLagoon(y + 1, x);
  fillLagoon(y, x + 1);
  fillLagoon(y, x - 1);
};
fillLagoon(1, 1);

console.log(lagoon.map(row => row.reduce((sum, n) => sum + (n === '#' ? 1 : 0), 0)).reduce((sum, n) => sum + n, 0));
debugger;
