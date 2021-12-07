const common = require('../common');

const crabs = common.lines('input')[0].split(',').map(n => +n);

console.log(
    Object.keys(
        crabs.reduce(
            (counts, crab) => ({
                ...counts,
                [crab]: (counts[crab] || 0) + 1,
            }),
            {},
        )
    )
    .map(key => crabs.reduce(
        (sum, crab) => sum + Math.abs(crab - +key),
        0
    ))
    .sort((a, b) => a - b)[0]
);

// Correct answer: 342641