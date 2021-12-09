const common = require('../common');

console.log(
  common.lines('input').reduce(
    (sum, entry) =>
      sum +
      entry
        .split('|')
        .map(v => v.trim().split(' '))[1]
        .filter(digit => digit.length !== 5 && digit.length !== 6).length,
    0
  )
);

// Correct answer: 274
