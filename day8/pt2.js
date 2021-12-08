const common = require('../common');

const indexMap = [
    [0, 1, 2, 4, 5, 6],     // 0
    [2, 5],                 // 1
    [0, 2, 3, 4, 6],        // 2
    [0, 2, 3, 5, 6, 7],     // 3
    [1, 2, 3, 5],           // 4
    [0, 1, 3, 5, 6],        // 5
    [0, 1, 3, 4, 5, 6],     // 6
    [0, 2, 5],              // 7
    [0, 1, 2, 3, 4, 5, 6],  // 8
    [0, 1, 2, 3, 5, 6]      // 9
];
const getDigitMap = signalPattern => {
    // Start by finding the 8, i.e. 7 digit input
    const eight = signalPattern.split(' ').filter(i => i.length === 7)[0].split('');

    // Build map
    return indexMap.reduce((map, index, i) => ({...map, [index.map(j => eight[j]).sort().join('')]: i}), {});
};

console.log(common.lines('sample').reduce(
    (sum, entry) => {
        const [signalPattern, output] = entry.split('|');
        const digitMap = getDigitMap(signalPattern);
        console.log(digitMap);
        return sum + +output.trim().split(' ').map(d => {
            const k = d.split('').sort().join('');
            console.log(k);
            return digitMap[k];
        }).join('');
    },
    0
));

// Correct answer: 