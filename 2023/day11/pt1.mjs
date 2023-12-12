import { lines } from '../../common.mjs';

const universe = lines('./input.txt').map(row => row.split(''));
universe[0].forEach((_, i) => {
  if (universe.map(row => row[i]).every(c => c === '.')) {
    universe.forEach(row => (row[i] = ['.', '.']));
  }
});
const expandedUniverse = universe
  .map(row => row.flat())
  .map(row => (row.every(c => c === '.') ? [row, row] : [row]))
  .flat();

const galaxies = [];
expandedUniverse.forEach((row, y) =>
  row.forEach(
    (space, x) =>
      space === '#' &&
      (coord =>
        galaxies.push({
          coord,
          nw: [coord],
          ne: [coord],
          sw: [coord],
          se: [coord],
          paths: {}
        }))([y, x])
  )
);

let gen = 0;
const nextGen = () => {
  const dedupe = arr => [...new Set(arr.map(i => i.join(',')))].map(i => i.split(',').map(n => parseInt(n)));
  gen++;
  galaxies.forEach(gen => {
    gen.nw = dedupe(
      gen.nw
        .map(step => [
          [step[0] - 1, step[1]],
          [step[0], step[1] - 1]
        ])
        .flat()
        .filter(step => step[0] >= 0 && step[1] >= 0)
    );
    gen.ne = dedupe(
      gen.ne
        .map(step => [
          [step[0] - 1, step[1]],
          [step[0], step[1] + 1]
        ])
        .flat()
        .filter(step => step[0] >= 0 && step[1] < expandedUniverse[0].length)
    );
    gen.sw = dedupe(
      gen.sw
        .map(step => [
          [step[0] + 1, step[1]],
          [step[0], step[1] - 1]
        ])
        .flat()
        .filter(step => step[0] < expandedUniverse.length && step[1] >= 0)
    );
    gen.se = dedupe(
      gen.se
        .map(step => [
          [step[0] + 1, step[1]],
          [step[0], step[1] + 1]
        ])
        .flat()
        .filter(step => step[0] < expandedUniverse.length && step[1] < expandedUniverse[0].length)
    );
  });
};
nextGen();

while (!galaxies.every(galaxy => Object.values(galaxy.paths).length === galaxies.length - 1)) {
  galaxies.forEach(galaxy =>
    [...new Set(galaxy.nw.concat(galaxy.ne, galaxy.sw, galaxy.se).map(step => step.join(',')))]
      .filter(step => galaxies.map(g => g.coord.join(',')).includes(step))
      .filter(m => !galaxy.paths[m])
      .forEach(m => (galaxy.paths[m] = gen))
  );
  console.log({
    gen,
    nw: galaxies.map(galaxy => galaxy.nw).flat().length,
    ne: galaxies.map(galaxy => galaxy.ne).flat().length,
    sw: galaxies.map(galaxy => galaxy.sw).flat().length,
    se: galaxies.map(galaxy => galaxy.se).flat().length
  });
  nextGen();
}

const paths = {};
galaxies.forEach(galaxy =>
  Object.entries(galaxy.paths).forEach(
    path => (paths[[galaxy.coord.toString(), path[0]].toSorted().toString()] = path[1])
  )
);
console.log(Object.values(paths).reduce((sum, n) => sum + n, 0));
debugger;
