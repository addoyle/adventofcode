import { lines } from '../../common.mjs';

const bounds = [200000000000000, 400000000000000];

const vectors = lines('./input.txt')
  .map(line => line.split(' @ ').map(p => p.split(', ').map(n => parseInt(n))))
  .map(([[px, py, pz], [vx, vy, vz]]) => ({ px, py, pz, vx, vy, vz }));

const intersect = (a, b) => {
  const d = a.vx * b.vy - a.vy * b.vx;

  // Parallel
  if (d === 0) {
    return null;
  }

  const t = ((b.px - a.px) * b.vy - (b.py - a.py) * b.vx) / d;
  const s = ((b.px - a.px) * a.vy - (b.py - a.py) * a.vx) / d;

  return {
    x: a.px + t * a.vx,
    y: a.py + t * a.vy,
    t,
    s
  };
};

console.log(
  vectors
    .map(
      (v1, i1) =>
        vectors
          .slice(i1 + 1)
          .map(v2 => intersect(v1, v2))
          .filter(
            i => i && i.t > 0 && i.s > 0 && i.x >= bounds[0] && i.x <= bounds[1] && i.y >= bounds[0] && i.y <= bounds[1]
          ).length
    )
    .reduce((sum, n) => sum + n, 0)
);
