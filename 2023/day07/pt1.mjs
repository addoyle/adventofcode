import { lines } from '../../common.mjs';

const values = '23456789TJQKA';

const handType = hand => {
  const hits = Object.values(hand.split('').reduce((o, card) => ({ ...o, [card]: (o[card] || 0) + 1 }), {})).toSorted(
    (a, b) => b - a
  );
  // Five of a kind, four of a kind, full house, three of a kind, two pair
  if (hits.length <= 3) {
    return (6 - hits.length) * 10 + hits[0] + 1;
  }

  // Pair or high card
  return hits.length === 4 ? 1 : 0;
};

const sort = (a, b) => {
  const diff = handType(a[0]) - handType(b[0]);
  if (diff !== 0) return diff;

  for (let i in a[0]) {
    if (a[0][i] !== b[0][i]) {
      return values.indexOf(a[0][i]) - values.indexOf(b[0][i]);
    }
  }

  return 0;
};

console.log(
  Object.entries(
    lines('./input.txt')
      .map(line => line.split(' '))
      .map(hb => [hb[0], parseInt(hb[1])])
      .reduce((o, hb) => ({ ...o, [hb[0]]: [...(o[hb[0]] || []), hb[1]] }), {})
  )
    .toSorted(sort)
    .map((bids, i) => bids[1].map(bid => bid * (i + 1)))
    .flat()
    .reduce((sum, win) => sum + win, 0)
);
