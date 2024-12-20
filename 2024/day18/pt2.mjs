import { ArraySet, lines } from '../../common.mjs';

const DIM = 71;

const coords = lines('./input.txt').map(line =>
  line.split(',').map(n => parseInt(n))
);

const isBlocked = len => {
  const grid = Array.from({ length: DIM }, () =>
    Array.from({ length: DIM }, () => '.')
  );
  coords.slice(0, len).forEach(([x, y]) => {
    grid[y][x] = '#';
  });

  for (let gen = [[0, 0]], g = 0; gen.length; g++) {
    const nextGen = new ArraySet();
    for (const [x, y] of gen) {
      // At the end
      if (y === grid.length - 1 && x === grid[0].length - 1) {
        return false;
      }

      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]
        .filter(([dx, dy]) => grid[y + dy]?.[x + dx] === '.')
        .map(([dx, dy]) => [x + dx, y + dy])
        .forEach(p => {
          nextGen.add(p);
          grid[p[1]][p[0]] = 'O';
        });
    }

    gen = [...new ArraySet(nextGen)];
  }
  return true;
};

// Check for blockage like a BST
const binarySearch = (min = DIM, max = coords.length) => {
  if (min === max) {
    return min;
  }
  const mid = min + Math.floor((max - min) / 2);
  if (isBlocked(mid)) {
    return binarySearch(min, mid - 1);
  } else {
    return binarySearch(mid + 1, max);
  }
};

console.log(coords[binarySearch()].join(','));
debugger;
