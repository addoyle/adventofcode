import { lines } from '../../common.mjs';

console.log(lines('./input.txt')
  .map(line => {
    const jolts = line.split('').map(n => parseInt(n));
    
    const digits = [];
    let indexOf = -1;
    for (let i = 11; i >= 0; i--) {
      const max = (i > 0
        ? jolts.slice(indexOf + 1, -i)
        : jolts.slice(indexOf + 1)
      ).reduce((m, n) => Math.max(m, n), 0);
      indexOf = jolts.indexOf(max, indexOf + 1);
      digits.push(max);
    }

    return parseInt(digits.join(''));
  })
  .reduce((sum, n) => sum + n)
);
