import { lines } from '../../common.mjs';

const universe = lines('./sample.txt').map(row => row.split(''));
universe[0].forEach((_, i) => {
  if (universe.map(row => row[i]).every(c => c === '.')) {
    universe.forEach(row => (row[i] = ['.', '.']));
  }
});
const expandedUniverse = universe
  .map(row => row.flat())
  .map(row => (row.every(c => c === '.') ? [row, row] : [row]))
  .flat();

const galaxies = {};
expandedUniverse.forEach((row, y) =>
  row.forEach((space, x) => space === '#' && (galaxies[`${y},${x}`] = { coord: [y, x], steps: 0 }))
);



let generation = Object.entries(galaxies).reduce(
  (o, [key, galaxy]) => ({
    ...o,
    [key]: {
      coord: galaxy.coord,
      nw: o[key]?.nw ? o[key].nw.add(key) : new Set([key]),
      ne: o[key]?.ne ? o[key].ne.add(key) : new Set([key]),
      sw: o[key]?.sw ? o[key].sw.add(key) : new Set([key]),
      se: o[key]?.se ? o[key].ne.add(key) : new Set([key])
    }
  }),
  {}
);

let gen = 0;
// const nextGen = () => {
//   const dedupe = arr => [...new Set(arr.map(i => i.join(',')))].map(i => i.split(',').map(n => parseInt(n)));
//   gen++;
//   galaxies.forEach(gen => {
//     gen.nw = dedupe(
//       gen.nw
//         .map(step => [
//           [step[0] - 1, step[1]],
//           [step[0], step[1] - 1]
//         ])
//         .flat()
//         .filter(step => step[0] >= 0 && step[1] >= 0)
//     );
//     gen.ne = dedupe(
//       gen.ne
//         .map(step => [
//           [step[0] - 1, step[1]],
//           [step[0], step[1] + 1]
//         ])
//         .flat()
//         .filter(step => step[0] >= 0 && step[1] < expandedUniverse[0].length)
//     );
//     gen.sw = dedupe(
//       gen.sw
//         .map(step => [
//           [step[0] + 1, step[1]],
//           [step[0], step[1] - 1]
//         ])
//         .flat()
//         .filter(step => step[0] < expandedUniverse.length && step[1] >= 0)
//     );
//     gen.se = dedupe(
//       gen.se
//         .map(step => [
//           [step[0] + 1, step[1]],
//           [step[0], step[1] + 1]
//         ])
//         .flat()
//         .filter(step => step[0] < expandedUniverse.length && step[1] < expandedUniverse[0].length)
//     );
//   });
// };
const nextGen = () => {
  gen++;
  const next = {};

  const addStep = (step, dx, dy, dir) => {
    if (!step[dir] || step[dir].size === 0) return;

    [
      [step.coord[0] + dy, step.coord[1]],
      [step.coord[0], step.coord[1] + dx]
    ]
      .filter(
        coord =>
          coord[0] >= 0 && coord[1] >= 0 && coord[0] < expandedUniverse.length && coord[1] < expandedUniverse[0].length
      )
      .forEach(coord => {
        const key = coord.join(',');
        next[key] = next[key] || { coord };
        next[key][dir] = next[key][dir] || new Set();
        next[key][dir].add(...step[dir]);
      });
  };

  Object.entries(generation).forEach(([_, step]) => {
    addStep(step, -1, -1, 'nw');
    addStep(step, -1, 1, 'ne');
    addStep(step, 1, -1, 'sw');
    addStep(step, 1, 1, 'se');
  });

  generation = next;
};
nextGen();

while (!Object.values(galaxies).every(galaxy => galaxy.steps > 0)) {
  Object.entries(generation)
    .filter(([key, step]) => galaxies[key] && galaxies[key].steps === 0)
    .forEach(([key, step]) => {});

  // galaxies.forEach(galaxy =>
  //   [...new Set(galaxy.nw.concat(galaxy.ne, galaxy.sw, galaxy.se).map(step => step.join(',')))]
  //     .filter(step => galaxies.map(g => g.coord.join(',')).includes(step))
  //     .filter(m => !galaxy.paths[m])
  //     .forEach(m => (galaxy.paths[m] = gen))
  // );
  // console.log({
  //   gen,
  //   nw: galaxies.map(galaxy => galaxy.nw).flat().length,
  //   ne: galaxies.map(galaxy => galaxy.ne).flat().length,
  //   sw: galaxies.map(galaxy => galaxy.sw).flat().length,
  //   se: galaxies.map(galaxy => galaxy.se).flat().length
  // });
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
