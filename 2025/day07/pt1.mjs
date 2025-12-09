import { lines } from '../../common.mjs';

let numSplits = 0;
let beams = new Set();
lines('./input.txt').forEach((row, i) => {
  // First row
  if (i === 0) {
    beams.add(row.indexOf('S'));
    return;
  }

  const nextGen = new Set();
  beams.forEach(beam => {
    if (row[beam] === '^') {
      nextGen.add(beam - 1);
      nextGen.add(beam + 1);
      numSplits++;
    } else {
      nextGen.add(beam);
    }
  });

  beams = nextGen;
});

console.log(numSplits);
