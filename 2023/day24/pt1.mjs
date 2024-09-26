import { lines } from '../../common.mjs';

const bounds = [200000000000000, 400000000000000];

const vectors = lines('./input.txt')
  .map(line => line.split(' @ ').map(p => p.split(', ').map(n => parseInt(n))))
  .map(([[px, py, pz], [vx, vy, vz]]) => ({ px, py, pz, vx, vy, vz }));

const intersect = (v1, v2) => {
  const d = v1.vx * v2.vy - v1.vy * v2.vx;

  // Parallel
  if (d === 0) {
    return null;
  }

  const t = ((v2.px - v1.px) * v2.vy - (v2.py - v1.py) * v2.vx) / d;
  const s = ((v2.px - v1.px) * v1.vy - (v2.py - v1.py) * v1.vx) / d;

  return {
    x: v1.px + t * v1.vx,
    y: v1.py + t * v1.vy,
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
