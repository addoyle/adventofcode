import { lines } from '../common.mjs';

const sensors = lines('./input.txt')
  .map(line =>
    line
      .replace(
        /^.*?x=([-\d]+), y=([-\d]+): .*?x=([-\d]+), y=([-\d]+).*?$/,
        (_, ...coords) => coords.slice(0, 4)
      )
      .split(',')
      .map(n => parseInt(n))
  )
  .map(([x, y, bx, by]) => ({
    x,
    y,
    bx,
    by,
    dist: Math.abs(x - bx) + Math.abs(y - by)
  }));

const combineRanges = rngs => {
  const cmb = [[...rngs[0]]];
  rngs.forEach(r => {
    let adj = false;
    for (let i in cmb) {
      const c = cmb[i];

      // Range is contained inside combined range, skip
      if (r[0] >= c[0] && r[1] <= c[1]) {
        adj = true;
        continue;
      }

      // Left bound is lower than combined range, adjust
      if (r[0] <= c[0] && r[1] >= c[0]) {
        c[0] = r[0];
        adj = true;
      }
      // Right bound is higher than combined range, adjust
      if (r[1] >= c[1] && r[0] <= c[1]) {
        c[1] = r[1];
        adj = true;
      }
    }

    // No ranges were adjusted, add
    if (!adj) {
      cmb.push(r);
    }
  });

  return cmb;
};

const seenPositions = row => {
  const ranges = sensors
    // Only check the sensors that are in range of the row
    .filter(s => s.y + s.dist > row && s.y - s.dist < row)
    .map(s => {
      const width = s.dist - Math.abs(row - s.y);
      return [s.x - width, s.x + width];
    });

  // Combine ranges and then combine the combined ranges
  return combineRanges(combineRanges(combineRanges(ranges)));
};

const MAX = 4000000;
const sensorRange = [
  Math.max(0, Math.min(...sensors.map(s => s.y - s.dist))),
  Math.min(MAX, Math.max(...sensors.map(s => s.y + s.dist)))
];

let y = sensorRange[0];
for (; y < sensorRange[1]; y++) {
  const seen = seenPositions(y);
  if (seen.some(r => r[0] > 0 || r[1] <= MAX)) {
    let x = 0;
    if (seen.length === 1) {
      x = seen[0][0] > 0 ? seen[0][0] : seen[0][1];
    } else if (seen.length > 1) {
      const lhole = Math.min(seen[0][1], seen[1][1]);
      const rhole = Math.max(seen[0][0], seen[1][0]);
      x = lhole + (rhole - lhole) / 2;
    }
    console.log(x * MAX + y);
    break;
  }
}

// Answer: 11840879211051
