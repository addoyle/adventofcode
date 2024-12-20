import { ArraySet, lines } from '../../common.mjs';

const grid = Array.from({ length: 71 }, () =>
  Array.from({ length: 71 }, () => '.')
);
lines('./input.txt')
  .map(line => line.split(',').map(n => parseInt(n)))
  .slice(0, 1024)
  .forEach(([x, y]) => {
    grid[y][x] = '#';
  });

for (let gen = [{ x: 0, y: 0, prev: null }], g = 0; gen.length; g++) {
  let found = false;
  const nextGen = [];
  for (const p of gen) {
    // At the end
    if (p.y === grid.length - 1 && p.x === grid[0].length - 1) {
      found = true;
      break;
    }

    nextGen.push(
      ...[
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]
        .filter(
          ([dx, dy]) =>
            !(p.x + dx === p.prev?.x && p.y + dy === p.prev?.y) &&
            grid[p.y + dy]?.[p.x + dx] === '.'
        )
        .map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy, prev: p }))
    );
  }

  if (found) {
    console.log(g);
    break;
  }

  // Dedupe
  const seen = new ArraySet();
  gen = nextGen.filter(p => {
    if (seen.has([p.x, p.y])) {
      return false;
    }
    seen.add([p.x, p.y]);
    return true;
  });
}
