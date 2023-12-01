import { readFileSync } from 'fs';

const [rawBins, instrucs] = readFileSync('./input.txt', 'utf8')
  .split('\n\n')
  .map(r => r.split('\n'));

// Pop off bottom row
rawBins.pop();

// Convert string representation of bins to 2d array
const bins = (rows => rows[0].map((_, i) => rows.map(row => row[i])))(
  rawBins
    .map(row => row.split(''))
    .map(row =>
      [...Array(Math.ceil(row.length / 4))].map(_ =>
        row.splice(0, 4).join('').trim().charAt(1)
      )
    )
).map(b => b.filter(c => c));

// Loop through instructions
instrucs.forEach(inst => {
  const [_move, n, _from, src, _to, dest] = inst
    .split(' ')
    .map(n => parseInt(n));

  [...Array(n)].forEach(_ => bins[dest - 1].unshift(bins[src - 1].shift()));
});

console.log(bins.map(bin => bin[0]).join(''));

// Answer: RFFFWBPNS
