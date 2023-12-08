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

let node = nodes.AAA;
let steps = 1;
let dir = nextDir();
for (; node[dir] !== 'ZZZ'; steps++, node = nodes[node[dir]], dir = nextDir());
console.log(steps);
