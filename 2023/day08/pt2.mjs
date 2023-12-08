import { lines } from '../../common.mjs';

const inputLines = lines('./input.txt');
const dirs = inputLines
  .shift()
  .split('')
  .map(dir => 'LR'.indexOf(dir));
inputLines.shift();

const nextDir = (() => {
  let i = Infinity;
  return () => dirs[(i = i + 1 >= dirs.length ? 0 : i + 1)];
})();

const nodes = inputLines
  .map(line => [.../^(\w+) = \((\w+), (\w+)\)$/.exec(line).slice(1)])
  .reduce((o, node) => ({ ...o, [node[0]]: node.slice(1) }), {});

let ghosts = Object.entries(nodes)
  .filter(([k, _]) => k.endsWith('A'))
  .map(([_, v]) => v);
let steps = 1;
let dir = nextDir();
while (!ghosts.every(ghost => ghost[dir].endsWith('Z'))) {
  steps++;
  ghosts = ghosts.map(ghost => nodes[ghost[dir]]);
  dir = nextDir();
  Date.now() % 10000 === 0 && console.log({ steps });
}
console.log(steps);
