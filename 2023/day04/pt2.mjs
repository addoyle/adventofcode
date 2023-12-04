import { lines } from '../../common.mjs';

const cards = [];

lines('./input.txt')
  .map(line =>
    ((winning, mine) => (set => mine.filter(n => set.has(n)).length)(new Set(winning)))(
      ...line
        .split(':')[1]
        .trim()
        .split('|')
        .map(nums =>
          nums
            .trim()
            .split(/\s+/)
            .map(n => parseInt(n))
        )
    )
  )
  .forEach((nums, i) => {
    cards[i] = (cards[i] || 0) + 1;
    [...Array(nums)].forEach((_, j) => (cards[i + j + 1] = (cards[i + j + 1] || 0) + cards[i]));
  });

console.log(cards.reduce((sum, n) => sum + n, 0));
