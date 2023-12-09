import { lines } from '../../common.mjs';

const inputLines = lines('./input.txt');
const dirs = inputLines
  .shift()
  .split('')
  .map(dir => 'LR'.indexOf(dir));
inputLines.shift();

let i = Infinity;
const nextDir = () => dirs[(i = i + 1 >= dirs.length ? 0 : i + 1)];

const nodes = inputLines
  .map(line => [.../^(\w+) = \((\w+), (\w+)\)$/.exec(line).slice(1)])
  .reduce((o, node) => ({ ...o, [node[0]]: node.slice(1) }), {});

let ghosts = Object.entries(nodes)
  .filter(([k, _]) => k.endsWith('A'))
  .map(([_, v]) => v)
  .map(ghost => {
    i = Infinity;
    let steps = 1;
    let dir = nextDir();

    while (!ghost[dir].endsWith('Z')) {
      steps++;
      ghost = nodes[ghost[dir]];
      dir = nextDir();
    }

    return steps;
  });

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

console.log(lcm(...ghosts));
