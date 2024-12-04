import { lines } from '../../common.mjs';

const trench = (([w, e, s, n]) => ({ n, s, e, w }))(
  [.../target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/.exec(lines('./input.txt')[0])]
    .slice(1)
    .map(n => parseInt(n))
);

// pre-calculate valid possible vx's
const validVx = {};
for (let vx = 1; vx <= trench.e; vx++) {
  for (let [x, t, v] = [0, 0, vx]; x <= trench.e && v > 0; x += v, v--, t++) {
    if (x >= trench.w && x <= trench.e) {
      validVx[vx] = Math.min(validVx[vx] ?? Infinity, t);
    }
  }
}

const maxHeight = vy => Math.floor((vy * (vy + 1)) / 2);

// find best pair
const bestPair = [
  ...new Set(
    Object.entries(validVx).map(([vx, tmin]) => {
      let maxVy = -Infinity;
      for (let t = tmin; t < 1000; t++) {
        const vy_min = Math.ceil((trench.s + Math.floor((t * (t - 1)) / 2)) / t);
        const vy_max = Math.floor((trench.n + Math.floor((t * (t - 1)) / 2)) / t);

        for (let vy = vy_min; vy <= vy_max; vy++) {
          let x = 0;
          for (let xt = 1, vxt = parseInt(vx); xt <= t; xt++, x += vxt, vxt += (vxt < 0) - (vxt > 0)) {
            if (vxt === 0) {
              break;
            }
          }

          // Ensure x is in bounds
          if (trench.w <= x && x <= trench.e) {
            maxVy = Math.max(maxVy, vy);
          }
        }
      }
      return { vx: parseInt(vx), vy: maxVy };
    })
  )
]
  // Filter out negatives
  .filter(({ vy }) => vy >= 0)
  .reduce((max, v) => (maxHeight(max.vy) > maxHeight(v.vy) ? max : v), 0);

console.log(maxHeight(bestPair.vy));
