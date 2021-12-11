const common = require('../common.js');

const lines = common.lines('input').filter(l => l).map(l => l.split(''));
const brackMap = {
  ')': { opener: '(', score: 3 },
  ']': { opener: '[', score: 57 },
  '}': { opener: '{', score: 1197 },
  '>': { opener: '<', score: 25137 }
};
const openers = Object.values(brackMap).map(b => b.opener);

console.log(lines.reduce((sum, line) => {
  const brackStack = [];

  for (const bracket of line) {
    const top = brackStack.slice(-1)[0];

    if (openers.includes(bracket)) {
      brackStack.push(bracket);
    } else {
      if (brackMap[bracket].opener === top) {
        brackStack.pop();
      } else {
        return sum + brackMap[bracket].score;
      }
    }
  }

  return sum;
}, 0));

// Correct answer: 367227
