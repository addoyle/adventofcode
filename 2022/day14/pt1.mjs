import { lines } from '../common.mjs';

const ROCK = 1;
const SAND = 2;

let cave = [];
lines('./input.txt')
  .map(line =>
    line.split('->').map(s =>
      s
        .trim()
        .split(',')
        .map(s => parseInt(s))
    )
  )
  .forEach(rocks => {
    for (
      let i = 0, [start, end] = rocks.slice(i, i + 2);
      i < rocks.length - 1;
      i++, [start, end] = rocks.slice(i, i + 2)
    ) {
      for (
        let y = Math.min(start[1], end[1]);
        y <= Math.max(start[1], end[1]);
        y++
      ) {
        for (
          let x = Math.min(start[0], end[0]);
          x <= Math.max(start[0], end[0]);
          x++
        ) {
          cave[y] = cave[y] || [];
          cave[y][x] = ROCK;
        }
      }
    }
  });
// Ensure there are no empty rows
cave = [...cave];
cave.forEach((row, i) => {
  if (!cave[i]) {
    cave[i] = [];
  }
});

const dropSand = () => {
  let [x, y] = [500, 0];
  // Loop until the sand has fallen into the abyss
  while (y < cave.length - 1) {
    // Hit something!
    if (cave[y + 1][x]) {
      // Fall left if possible
      if (cave[y + 1][x - 1] === undefined) {
        y++;
        x--;
        continue;
      }
      // Fall right if possible
      if (cave[y + 1][x + 1] === undefined) {
        y++;
        x++;
        continue;
      }
      // Nowhere to fall, STOP!
      cave[y][x] = SAND;
      return true;
    }

    y++;
  }

  return false;
};

// Keep dropping until full
let i = 0;
for (; dropSand(); i++);

console.log(i);

// Answer: 994
