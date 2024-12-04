import { lines } from '../../common.mjs';

const octis = lines('input').map(l => l.split('').map(Number));

// Only increment if they haven't already flashed this generation
const inc = (i, j) => (octis[i][j] += octis[i][j] > 0 ? 1 : 0);

let gen = 0;
for (; !octis.every(row => row.every(octi => octi === 0)); gen++) {
  // First step, charge up all the octis
  octis.forEach((row, i) => row.forEach((octi, j) => octis[i][j]++));

  // Repeat until all flashers have flashed
  while (octis.some(row => row.some(octi => octi >= 10))) {
    // Handle flashers
    octis.forEach((row, i) =>
      row.forEach((octi, j) => {
        // Found a flasher
        if (octi >= 10) {
          // Set flasher to 0
          octis[i][j] = 0;

          // Charge up neighbors
          if (i > 0) {
            if (j > 0) inc(i - 1, j - 1);
            inc(i - 1, j);
            if (j < row.length - 1) inc(i - 1, j + 1);
          }
          if (j > 0) inc(i, j - 1);
          if (j < row.length - 1) inc(i, j + 1);
          if (i < octis.length - 1) {
            if (j > 0) inc(i + 1, j - 1);
            inc(i + 1, j);
            if (j < row.length - 1) inc(i + 1, j + 1);
          }
        }
      })
    );
  }
}

console.log(gen);

// Correct answer: 290
