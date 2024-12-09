import { lines } from '../../common.mjs';

let bounds = {};

const inBounds = ([x, y]) => x >= 0 && x < bounds.x && y >= 0 && y < bounds.y;

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
          let pt = [...a];
          while (inBounds(pt)) {
            s.add(pt.join(','));
            pt[0] -= d[0];
            pt[1] -= d[1];
          }
          pt = [...b];
          while (inBounds(pt)) {
            s.add(pt.join(','));
            pt[0] += d[0];
            pt[1] += d[1];
          }
        }
      });
    });
    return s;
  }, new Set())
);
