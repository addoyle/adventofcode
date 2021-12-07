const common = require('../common');

const crabs = common.lines('input')[0].split(',').map(n => +n);

const min = crabs.sort((a, b) => a - b)[0];
const max = crabs.slice(-1);
const fuels = [];

for (let i = min; i < max; i++) {
  fuels.push(crabs.reduce(
    (sum, crab) => {
      const n = Math.abs(crab - i);
      return sum + (n * (n + 1) / 2)
    },
    0
  ))
}

console.log(fuels.sort((a, b) => a - b)[0]);

// Correct answer: 93006301