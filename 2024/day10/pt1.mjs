import { lines, StackSet } from '../../common.mjs';

const map = lines('./input.txt').map(line => line.split('').map(n => (isNaN(n) ? -Infinity : parseInt(n))));

const toId = ([x, y]) => y * map.length + x;
const toPt = id => [id % map.length, Math.floor(id / map.length)];

// Find trailheads
let gen = map.reduce((trailheads, row, y) => {
  row.forEach((height, x) => {
    if (height === 0) {
      trailheads.push(new StackSet([toId([x, y])]));
    }
  });
  return trailheads;
}, []);

// Find paths to 9 using BFS
for (let h = 1; h <= 9; h++) {
  const nextGen = [];
  gen.forEach((path, i) => {
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

    // Add path for each valid neighbor
    neighbors.forEach(n => {
      nextGen.push(new StackSet([...path, n]));
    });
  });
  gen = nextGen;
}

console.log(new Set(gen.map(path => [path.values().next().value, path.top].join(','))).size);
