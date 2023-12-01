import { lines } from '../../common.mjs';

const numWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const matches = line => {
  const mats = [];
  const regex = new RegExp(/(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g);
  let match;
  while ((match = regex.exec(line)) !== null) {
    mats.push(match[1]);
    regex.lastIndex === match.index && regex.lastIndex++;
  }
  return mats;
};

console.log(
  lines('./input.txt')
    .map(matches)
    .map(m => [m[0], m.slice(-1)[0]])
    .map(tips => tips.map(n => (isNaN(n) ? numWords.indexOf(n) : parseInt(n))))
    // .map(tips => tips.join(','))
    .map(tips => parseInt(tips.join('')))
    .reduce((sum, n) => sum + n, 0)
);
