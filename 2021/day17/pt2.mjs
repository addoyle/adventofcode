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

// find all pairs
const allPairs = new Set(
  Object.entries(validVx)
    .map(([vx, tmin]) => {
      const pairs = [];

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
            pairs.push(`${parseInt(vx)}-${vy}`);
          }
        }
      }
      return pairs;
    })
    .flat()
);
console.log(allPairs.size);
