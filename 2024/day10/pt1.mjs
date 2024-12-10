import { lines, StackSet } from '../../common.mjs';

const map = lines('./sample1.txt').map(line => line.split('').map(n => (isNaN(n) ? -Infinity : parseInt(n))));

const toId = ([x, y]) => y * map.length + x;
const toPt = id => [id % map.length, Math.floor(id / map.length)];

// Find trailheads
const paths = map.reduce((trailheads, row, y) => {
  row.forEach((height, x) => {
    if (height === 0) {
      trailheads.push(new StackSet([toId([x, y])]));
    }
  });
  return trailheads;
}, []);

// Find paths to 9 using BFS
for (let h = 1; h <= 9; h++) {
  // TODO: Record only head and tail, not all possible paths

  paths.forEach((path, i) => {
    const [x, y] = toPt(path.top);
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ]
      .filter(([x, y]) => map[y]?.[x] !== undefined && map[y][x] === h)
      .map(toId)
      .filter(id => !path.has(id));

    // No valid step, remove
    if (!neighbors.length) {
      paths.splice(i, 1);
      return;
    }

    // More than one, add additional paths
    if (neighbors.length > 1) {
      neighbors.slice(1).forEach(n => {
        paths.push(new StackSet([...path, n]));
      });
    }

    // Add step to original path
    path.push(neighbors[0]);
  });
}
debugger;
