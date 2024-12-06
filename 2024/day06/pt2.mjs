import { lines } from '../../common.mjs';

let pos = {};
const visited = new Set();
const d = [0, -1];
const loops = new Set();

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

const key = (pos, d) => [Object.values(pos).join(','), d.join(',')].join('+');

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

  // If you were to turn right now and double back on yourself going in the same diretion,
  // that will cause a loop
  const l = [...d.toReversed()];
  l[0] *= -1;
  let look = { ...pos };
  // Look straight until obstacle, edge, or visited step has been reached
  while (look.x >= 0 && look.x < grid[0].length && look.y >= 0 && look.y < grid.length && !grid[look.y][look.x]) {
    look.x += l[0];
    look.y += l[1];

    if (visited.has(key(look, l))) {
      loops.add([pos.x + d[0], pos.y + d[1]].join(','));
      break;
    }
  }

  visited.add(key(pos, d));
} while (pos.x + d[0] >= 0 && pos.x + d[0] < grid[0].length && pos.y + d[1] >= 0 && pos.y + d[1] < grid.length);

console.log(loops.size);
