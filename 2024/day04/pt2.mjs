import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line => line.split(''))
    .reduce((sum, row, y, rows) => {
      row.forEach((c, x) => {
        // look for A's
        if (c !== 'A') {
          return sum;
        }

        sum += ['MMSS', 'SSMM', 'SMSM', 'MSMS'].includes(
          rows
            .slice(y - 1, y + 2)
            .toSpliced(1, 1)
            .map(r =>
              r
                .slice(x - 1, x + 2)
                .toSpliced(1, 1)
                .join('')
            )
            .join('')
        );
      });
      return sum;
    }, 0)
);
