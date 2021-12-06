const common = require('../common');

const input = common.lines('input');

const sep = ' -> ';
const pairs = input.map(line =>
    line.split(sep)
        .map(pair => 
            pair.split(',').map(p => +p)
        )
)
// Only doing lines for now, strip out diagonals (i.e. x1 != x2 && y1 != y2)
.filter(pair => pair[0][0] === pair[1][0] || pair[0][1] === pair[1][1]);

const coveredPoints = {};
pairs.forEach(pair => {
    const [x1, y1, x2, y2] = [...pair[0], ...pair[1]];
    for(let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
        for(let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
            coveredPoints[`${i},${j}`] = (coveredPoints[`${i},${j}`] || 0) + 1;
        }
    }
});

console.log(Object.values(coveredPoints).filter(n => n > 1).length);

// Correct answer: 5608