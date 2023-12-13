import { lines } from '../../common.mjs';

const universe = lines('./input.txt').map(row => row.split(''));

const galaxies = [];
universe.forEach((row, y) =>
  row.forEach((space, x) => space === '#' && galaxies.push({ x, y, orig: [y, x], paths: [] }))
);

const expandFactor = 1;

// Expand y
universe.forEach((row, i) => {
  if (row.every(c => c === '.')) {
    galaxies.filter(g => g.orig[0] > i).forEach(g => (g.y += expandFactor));
  }
});
// Expand x
universe[0].forEach((_, i) => {
  if (universe.map(row => row[i]).every(c => c === '.')) {
    galaxies.filter(g => g.orig[1] > i).forEach(g => (g.x += expandFactor));
  }
});

galaxies.forEach(
  src =>
    (src.paths = galaxies
      .filter(dest => !(dest.x === src.x && dest.y === src.y))
      .map(dest => ({ dest, steps: Math.abs(src.x - dest.x) + Math.abs(src.y - dest.y) })))
);

// Remove path dupes
galaxies.forEach((src, i) => {
  galaxies.slice(i + 1).forEach(dest => {
    const toDel = dest.paths.find(path => path.dest.x === src.x && path.dest.y === src.y);
    if (toDel) {
      toDel.steps = 0;
    }
  });
});

console.log(galaxies.map(g => g.paths.reduce((sum, n) => sum + n.steps, 0)).reduce((sum, n) => sum + n, 0));
