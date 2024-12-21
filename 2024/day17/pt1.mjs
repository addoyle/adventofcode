import { lines } from '../../common.mjs';

let [a, b, c, _, program] = lines('./input.txt').map(line => line.split(': ')[1]);
a = parseInt(a);
b = parseInt(b);
c = parseInt(c);
program = program.split(',').map(n => parseInt(n));
let p = 0;
const output = [];

const combo = o => [0, 1, 2, 3, a, b, c, undefined][o];
const inc = () => (p += 2);
const ops = [
  // adv
  o => inc((a = Math.floor(a / 2 ** combo(o)))),
  // bxl
  o => inc((b ^= o)),
  // bst
  o => inc((b = combo(o) % 8)),
  // jnz
  o => (p = a !== 0 ? o : p + 2),
  // bxc
  () => inc((b ^= c)),
  // out
  o => inc(output.push(combo(o) % 8)),
  // bdv
  o => inc((b = Math.floor(a / 2 ** combo(o)))),
  // cdv
  o => inc((c = Math.floor(a / 2 ** combo(o))))
];

while (p < program.length) {
  ops[program[p]](program[p + 1]);
}
console.log(output.join(','));
