import { lines } from '../../common.mjs';

let pos = {};
const visited = new Set();
const d = [0, -1];

const grid = lines('./input.txt').map((line, y) =>
  line.split('').map((c, x) => {
    if (c === '^') {
      pos = { x, y };
      visited.add(Object.values(pos).join(','));
      return 0;
    }
    return '.#'.indexOf(c);
  })
);

// Start walkin
do {
  // Obstacle? Turn 90
  if (grid[pos.y + d[1]][pos.x + d[0]]) {
    d.reverse();
    d[0] *= -1;
  }

  // Take a step!
  pos.x += d[0];
  pos.y += d[1];

  visited.add(Object.values(pos).join(','));
} while (pos.x + d[0] >= 0 && pos.x + d[0] < grid[0].length && pos.y + d[1] >= 0 && pos.y + d[1] < grid.length);

console.log(visited.size);
