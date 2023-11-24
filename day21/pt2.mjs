import { lines } from '../common.mjs';

const ops = {
    '+': (m1, m2) => m1 + m2,
    '-': (m1, m2) => m1 - m2,
    '*': (m1, m2) => m1 * m2,
    '/': (m1, m2) => m1 / m2
};
const hits = {};

const monkeys = lines('input.txt').reduce((o, line) => {
    const [monkey, raw] = line.split(':');
    if (monkey === 'humn') {
        o[monkey] = () => {hits[monkey] = (hits[monkey] || 0) + 1; return 0;};
    } else if (!isNaN(raw.trim())) {
        o[monkey] = () => {hits[monkey] = (hits[monkey] || 0) + 1; return parseInt(raw.trim());};
    } else {
        const [m1, op, m2] = raw.trim().split(' ');
        o[monkey] = monkey === 'root'
            ? () => {
                hits[monkey] = (hits[monkey] || 0) + 1;
                const monk1 = monkeys[m1]();
                const monk2 = monkeys[m2]();
                console.log({monk1, monk2});
                return monk1 === monk2;
            }
            : () => {hits[monkey] = (hits[monkey] || 0) + 1; return ops[op](monkeys[m1](), monkeys[m2]());};
    }
    return o;
}, {});

console.log(monkeys['root']());