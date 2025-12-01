import { ArraySet, lines } from '../../common.mjs';

const grid = lines('./input.txt').map(line => line.split(''));

const start = [grid.findIndex(row => row.includes('S')), grid.find(row => row.includes('S')).indexOf('S')];
const end = [grid.findIndex(row => row.includes('E')), grid.find(row => row.includes('E')).indexOf('E')];
grid[start[0]][start[1]] = '.';
grid[end[0]][end[1]] = '.';

const shortestPath = (cheat, tooLong = Infinity) => {
  const queue = [[...start, 0]];
  const visited = new ArraySet([start]);
  while (queue.length) {
    const [y, x, d] = queue.shift();

    // At the end
    if (end[0] === y && end[1] === x) {
      return d;
    }

    // Path too long
    if (d > tooLong) {
      return null;
    }

    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ]
      // Not blocked or visited, unless it's the cheat
      .filter(
        ([dy, dx]) =>
          !visited.has([y + dy, x + dx]) &&
          (grid[y + dy][x + dx] !== '#' || (y + dy === cheat[0] && x + dx === cheat[1]))
      )
      .forEach(([dy, dx]) => {
        queue.push([y + dy, x + dx, d + 1]);
        visited.add([y + dy, x + dx]);
      });
  }

  // No path exists
  return null;
};

// First get the non-cheating distance
const honestPath = shortestPath([]);

// Find all single-width walls that can be cheated through
const possibleCheats = [];
for (let y = 1; y < grid.length - 1; y++) {
  for (let x = 1; x < grid[y].length - 1; x++) {
    // Horizontal cheat
    if (grid[y].slice(x - 1, x + 2).join('') === '.#.') {
      possibleCheats.push([y, x]);
    }
    // Vertical cheat
    if (
      grid
        .slice(y - 1, y + 2)
        .map(row => row[x])
        .join('') === '.#.'
    ) {
      possibleCheats.push([y, x]);
    }
  }
}

console.log(
  possibleCheats
    .map(cheat => shortestPath(cheat, honestPath - 100))
    .map(d => honestPath - d)
    .filter(Boolean).length
);

debugger;
