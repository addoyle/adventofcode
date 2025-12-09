import { lines } from '../../common.mjs';

let timelines = new Map();
lines('./input.txt').forEach((row, i) => {
  // First row
  if (i === 0) {
    timelines.set(row.indexOf('S'), 1);
    return;
  }

  const nextGen = new Map();
  timelines.forEach((count, beam) => {
    if (row[beam] === '^') {
      nextGen.set(beam - 1, count + (nextGen.get(beam - 1) ?? 0));
      nextGen.set(beam + 1, count + (nextGen.get(beam + 1) ?? 0));
    } else {
      nextGen.set(beam, count + (nextGen.get(beam) ?? 0));
    }
  });

  timelines = nextGen;
});

console.log(timelines.values().reduce((sum, beamCount) => sum + beamCount, 0));
