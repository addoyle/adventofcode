import { lines } from '../../common.mjs';

const isSafe = report => {
  let prev;
  for (const level of report) {
    if (prev !== undefined && (level - prev < 1 || level - prev > 3)) {
      return false;
    }
    prev = level;
  }
  return true;
};

console.log(
  lines('./input.txt')
    .map(line => line.split(' ').map(n => parseInt(n)))
    .filter(report => isSafe(report) || isSafe(report.toReversed())).length
);
