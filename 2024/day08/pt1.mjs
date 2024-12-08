import { lines } from '../../common.mjs';

let bounds = {};

const addIfBounded = (set, [x, y]) => {
  if (x >= 0 && x < bounds.x && y >= 0 && y < bounds.y) {
    set.add([x, y].join(','));
  }
};

console.log(
  Object.values(
    lines('./input.txt').reduce((o, line, y, arr) => {
      bounds.y = arr.length;
      [...line].forEach((c, x, ln) => {
        bounds.x = ln.length;
        if (c !== '.') {
          o[c] ??= [];
          o[c].push([x, y]);
        }
      });
      return o;
    }, {})
  ).reduce((s, pts) => {
    pts.forEach(a => {
      pts.forEach(b => {
        if (a.join(',') !== b.join(',')) {
          const d = a.map((v, i) => b[i] - v);
          addIfBounded(s, [a[0] - d[0], a[1] - d[1]]);
          addIfBounded(s, [b[0] + d[0], b[1] + d[1]]);
        }
      });
    });
    return s;
  }, new Set())
);
