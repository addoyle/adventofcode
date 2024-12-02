import { lines } from '../../common.mjs';

const isSafe = (report, retry = true) => {
  let good = true;
  for (let i = 0, level = report[0], prev; i < report.length; i++, prev = level, level = report[i]) {
    if (prev !== undefined && (level - prev < 1 || level - prev > 3)) {
      good = false;
    }
  }
  return good || (retry && report.some((_, i) => isSafe(report.toSpliced(i, 1), false)));
};

console.log(
  lines('./input.txt')
    .map(line => line.split(' ').map(n => parseInt(n)))
    .filter(report => isSafe(report) || isSafe(report.toReversed())).length
);
