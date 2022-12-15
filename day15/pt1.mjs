import { lines } from '../common.mjs';

const sensors = lines('./input.txt')
  .map(line =>
    line.replace(
      /^.*?x=([-\d]+), y=([-\d]+): .*?x=([-\d]+), y=([-\d]+).*?$/,
      (_, ...coords) => coords.slice(0,4)
    ).split(',').map(n => parseInt(n))
  )
  .map(([x, y, bx, by]) => ({x, y, bx, by, dist: Math.abs(x - bx) + Math.abs(y - by)}));

const combineRanges = rngs => {
  const cmb = [[...rngs[0]]];
  rngs.forEach(r => {
    let adj = false;
    for (let i in cmb) {
      const c = cmb[i];
      
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
  const combinedRanges = combineRanges(combineRanges(ranges));

  const rangeSize = combinedRanges.reduce((sum, r) => sum + (r[1] - r[0]), 0) + 1;
  const beacons = [...new Set(sensors.filter(s => s.by === row).map(s => s.bx))]
    .filter(bx => combinedRanges.some(r => bx >= r[0] && bx <= r[1]));
  
  // Return size of range minus any known beacons
  return rangeSize - beacons.length;
}

console.log(seenPositions(2000000));

// Answer: 5394423