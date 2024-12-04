import { lines } from '../../common.mjs';

const inputLines = lines('./input')
  .filter(l => l)
  .map(l => l.split(''));
const brackMap = {
  ')': { opener: '(' },
  ']': { opener: '[' },
  '}': { opener: '{' },
  '>': { opener: '<' },
  '(': { closer: ')', score: 1 },
  '[': { closer: ']', score: 2 },
  '{': { closer: '}', score: 3 },
  '<': { closer: '>', score: 4 }
};
const openers = Object.values(brackMap)
  .map(b => b.opener)
  .filter(o => o);

const scores = inputLines
  .map(line => {
    const brackStack = [];

    for (const bracket of line) {
      const top = brackStack.slice(-1)[0];

      if (openers.includes(bracket)) {
        brackStack.push(bracket);
      } else {
        if (brackMap[bracket].opener === top) {
          brackStack.pop();
        } else {
          return null;
        }
      }
    }

    const closerScores = brackStack.reverse().map(b => brackMap[b].score);

    return closerScores.reduce((final, score) => final * 5 + score);
  }, 0)
  .filter(s => s)
  .sort((a, b) => a - b);

console.log(scores[Math.floor(scores.length / 2)]);

// Correct answer: 3583341858
