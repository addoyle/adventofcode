import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line => line.split(''))
    .reduce((sum, row, y, rows) => {
      row.forEach((c, x) => {
        // only starts with X
        if (c !== 'X') {
          return sum;
        }

        // horiz right
        sum += row.slice(x, x + 4).join('') === 'XMAS';
        // horiz left
        sum += row.slice(x - 3, x + 1).join('') === 'SAMX';
        // vert down
        sum +=
          rows
            .slice(y, y + 4)
            .map(r => r[x])
            .join('') === 'XMAS';
        // vert up
        sum +=
          rows
            .slice(y - 3, y + 1)
            .map(r => r[x])
            .join('') === 'SAMX';
        // diag down/right
        sum +=
          rows
            .slice(y, y + 4)
            .map((r, i) => r[x + i])
            .join('') === 'XMAS';
        // diag down/left
        sum +=
          rows
            .slice(y, y + 4)
            .map((r, i) => r[x - i])
            .join('') === 'XMAS';
        // diag up/right
        sum +=
          rows
            .slice(y - 3, y + 1)
            .toReversed()
            .map((r, i) => r[x + i])
            .join('') === 'XMAS';
        // diag up/left
        sum +=
          rows
            .slice(y - 3, y + 1)
            .toReversed()
            .map((r, i) => r[x - i])
            .join('') === 'XMAS';
      });
      return sum;
    }, 0)
);
