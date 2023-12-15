import { lines } from '../../common.mjs';

const rocks = lines('./sample.txt').map(line => [...line]);

const transpose = a => {
  const arr = a[0].map((_, i) => a.map(r => r[i]));
  rocks.length = 0;
  arr.forEach((row, i) => (rocks[i] = row));
};

// Rocks fall from right to left
const fallAndGetLoad = () => {
  let load = 0;

  rocks.forEach(row => {
    let i = 0;
    row.forEach((rock, x) => {
      let blocked = false;
      if (rock === 'O') {
        row[x] = '.';
        row[i++] = 'O';

        if (!blocked) {
          load += row.length - i + 1;
        }
      }
      if (rock === '#') {
        i = x + 1;
        blocked = true;
      }
    });
  });

  return load;
};

const fallNorth = () => {
  transpose(rocks);
  const load = fallAndGetLoad();
  transpose(rocks);
  return load;
};
console.log(fallNorth());
