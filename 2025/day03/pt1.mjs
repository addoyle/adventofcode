import { lines } from '../../common.mjs';

console.log(lines('./input.txt')
  .map(line => {
    const jolts = line.split('').map(n => parseInt(n));
    
    const max = jolts.slice(0, -1).reduce((m, n) => Math.max(m, n), 0);
    const nextMax = jolts.slice(jolts.indexOf(max) + 1).reduce((m, n) => Math.max(m, n), 0);

    return parseInt([max, nextMax].join(''));
  })
  .reduce((sum, n) => sum + n)
);
