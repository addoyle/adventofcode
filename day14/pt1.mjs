import { lines } from '../common.mjs';

const ROCK = 1;
const SAND = 2;

let cave = [];
lines('./input.txt').map(line => line.split('->').map(s => s.trim().split(',').map(s => parseInt(s))))
  .forEach(rocks => {
    for (let i = 0, [start, end] = rocks.slice(i, i+2); i < rocks.length - 1; i++, [start, end] = rocks.slice(i,i+2)) {
      for (let y = Math.min(start[1], end[1]); y <= Math.max(start[1], end[1]); y++) {
        for (let x = Math.min(start[0], end[0]); x <= Math.max(start[0], end[0]); x++) {
          cave[y] = (cave[y] || []);
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

const spout = [500,0];
const dropSand = () => {
  let [x,y] = spout;
  // Loop until the sand has fallen into the abyss
  while (y < cave.length - 1) {
    // Hit something!
    if (cave[y + 1][x]) {
      // Fall left if possible
      if (cave[y + 1][x - 1] === undefined) {
        y++; x--;
        continue;
      }
      // Fall right if possible
      if (cave[y + 1][x + 1] === undefined) {
        y++; x++;
        continue;
      }
      // Nowhere to fall, STOP!
      cave[y][x] = SAND;
      return true;
    }
    
    y++;
  }

  return false;
}

const printCave = () => {
  // Find bounds of cave
  const bounds = {};
  for (let y = 0; y < cave.length; y++) {
    if (cave[y] && cave[y].length) {
      if (!bounds.y) {
        bounds.y = y;
      }
      bounds.dy = y;

      for (let x = 0; x < cave[y].length; x++) {
        if (cave[y][x]) {
          if (!bounds.x || bounds.x > x) {
            bounds.x = x;
          }
          if (!bounds.dx || x > bounds.dx) {
            bounds.dx = x;
          }
        }
      }
    }
  }
  
  console.log(cave
    .slice(bounds.y, bounds.dy + 1)
    .map(row => [...row.slice(bounds.x, bounds.dx + 1)]
      .map(r => r ? r === ROCK ? '#' : 'o' : ' ')
      .join(''))
    .join('\n'));
}

// printCave();
// Keep dropping until full
let i = 0;
for (; dropSand(); i++);

printCave();

console.log(i);