import { lines } from '../../common.mjs';

const island = lines('./sample.txt').map(row => row.split(''));
const start = [0, island[0].indexOf('.')];
const firstStep = [start[0] + 1, start[1]];
let max = 0;

const printPath = been =>
  console.log(
    island
      .map((row, y) =>
        row.map((f, x) => (been.has([y, x].toString()) ? 'O' : f)).join('')
      )
      .join('\n')
  );

const spurs = {};
// Build spurs
const spur = (pos, step, startPos = pos, startStep = step, steps = 0) => {
  // Spur already exists, skip
  if (spurs[`${pos}`] && spurs[`${pos}`][`${step}`]) return;

  const pSteps = [
    [step[0] - 1, step[1]],
    [step[0] + 1, step[1]],
    [step[0], step[1] - 1],
    [step[0], step[1] + 1]
  ].filter(
    s =>
      // In bounds
      s[0] >= 0 &&
      s[0] < island.length &&
      // Not pos
      !(s[0] === pos[0] && s[1] === pos[1]) &&
      // Not a tree
      island[s[0]][s[1]] !== '#'
  );

  // No fork, keep moving
  if (pSteps.length === 1) {
    spur(step, pSteps[0], startPos, startStep, steps + 1);
  }
  // Fork reached, add to spurs and keep moving
  else {
    spurs[`${startPos}`] = {
      ...spurs[`${startPos}`],
      [`${startStep}`]: {
        steps,
        start: startPos,
        key: `${startPos}-${startStep}`,
        end: step
      }
    };

    pSteps.forEach(ps => spur(step, ps));
  }
};
spur(start, firstStep); // Start spurring
const startSpur = spurs[`${start}`][`${firstStep}`];

const walk = () => {
  let gen = [{ spur: startSpur, been: { [`${startSpur.start}`]: startSpur } }];
  while (gen.length) {
    gen = gen
      .map(path =>
        Object.values(spurs[`${path.spur.end}`])
          .filter(spur => !path.been[`${spur.end}`])
          .map(spur => ({
            spur,
            been: { ...path.been, [`${spur.start}`]: spur }
          }))
          .flat()
      )
      .flat();
  }
};

walk();

console.log(max);
